const { supabase } = require('../config/supabase');
const config = require('../config/env');
const { AppError } = require('../middlewares/errorHandler.middleware');
const crypto = require('crypto');
const path = require('path');

const BUCKET_NAME = 'images';

// Логируем конфигурацию при загрузке
console.log('📷 Upload Service initialized');
console.log('   Supabase URL:', config.supabaseUrl || 'NOT SET');
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

class UploadService {
  /**
   * Генерация уникального имени файла
   * @param {string} originalName - Оригинальное имя файла
   * @param {string} folder - Папка для хранения
   * @returns {string} - Уникальное имя файла
   */
  generateFileName(originalName, folder = 'general') {
    const ext = path.extname(originalName).toLowerCase() || '.jpg';
    const hash = crypto.randomBytes(16).toString('hex');
    const timestamp = Date.now();
    return `${folder}/${timestamp}-${hash}${ext}`;
  }

  /**
   * Валидация файла
   * @param {Object} file - Файл для валидации
   */
  validateFile(file) {
    if (!file) {
      throw new AppError('File is required', 400);
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new AppError(`File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`, 400);
    }

    if (!ALLOWED_TYPES.includes(file.mimetype)) {
      throw new AppError(`Invalid file type. Allowed types: ${ALLOWED_TYPES.join(', ')}`, 400);
    }
  }

  /**
   * Загрузка изображения
   * @param {Buffer} buffer - Буфер файла
   * @param {string} fileName - Имя файла
   * @param {string} contentType - MIME тип
   * @returns {Object} - URL загруженного файла
   */
  async uploadImage(buffer, fileName, contentType) {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, buffer, {
        contentType,
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      throw new AppError('Failed to upload image', 500);
    }

    // Получаем публичный URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    console.log('Upload successful:', {
      path: data.path,
      publicUrl: urlData.publicUrl
    });

    return {
      path: data.path,
      url: urlData.publicUrl
    };
  }

  /**
   * Загрузка изображения товара
   * @param {Object} file - Файл
   * @param {string} shopId - ID магазина
   * @returns {Object} - URL загруженного файла
   */
  async uploadProductImage(file, shopId) {
    this.validateFile(file);
    
    const fileName = this.generateFileName(file.originalname, `products/${shopId}`);
    return await this.uploadImage(file.buffer, fileName, file.mimetype);
  }

  /**
   * Загрузка обложки магазина
   * @param {Object} file - Файл
   * @param {string} shopId - ID магазина
   * @returns {Object} - URL загруженного файла
   */
  async uploadShopCover(file, shopId) {
    this.validateFile(file);
    
    const fileName = this.generateFileName(file.originalname, `shops/${shopId}/cover`);
    return await this.uploadImage(file.buffer, fileName, file.mimetype);
  }

  /**
   * Загрузка логотипа/изображения магазина
   * @param {Object} file - Файл
   * @param {string} shopId - ID магазина
   * @returns {Object} - URL загруженного файла
   */
  async uploadShopImage(file, shopId) {
    this.validateFile(file);
    
    const fileName = this.generateFileName(file.originalname, `shops/${shopId}/image`);
    return await this.uploadImage(file.buffer, fileName, file.mimetype);
  }

  /**
   * Удаление изображения
   * @param {string} filePath - Путь к файлу
   */
  async deleteImage(filePath) {
    if (!filePath) return;

    // Извлекаем путь из полного URL если нужно
    let pathToDelete = filePath;
    if (filePath.includes('/storage/v1/object/public/images/')) {
      pathToDelete = filePath.split('/storage/v1/object/public/images/')[1];
    }

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([pathToDelete]);

    if (error) {
      console.error('Delete error:', error);
      // Не бросаем ошибку - удаление не критично
    }
  }
}

module.exports = new UploadService();
