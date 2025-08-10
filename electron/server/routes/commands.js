const express = require('express');
const Joi = require('joi');
const router = express.Router();

// 验证模式
const commandSchema = Joi.object({
  name: Joi.string().required().min(1).max(100),
  command: Joi.string().required().min(1).max(1000),
  description: Joi.string().allow('').max(500),
  category_id: Joi.number().integer().allow(null),
  tags: Joi.string().allow('').max(200)
});

const updateCommandSchema = Joi.object({
  name: Joi.string().min(1).max(100),
  command: Joi.string().min(1).max(1000),
  description: Joi.string().allow('').max(500),
  category_id: Joi.number().integer().allow(null),
  tags: Joi.string().allow('').max(200),
  is_favorite: Joi.boolean()
});

// 获取所有命令
router.get('/', (req, res) => {
  try {
    const { category_id, search, favorite } = req.query;
    const db = req.app.locals.db;
    
    let query = `
      SELECT c.*, cat.name as category_name, cat.color as category_color
      FROM commands c
      LEFT JOIN categories cat ON c.category_id = cat.id
    `;
    
    const conditions = [];
    const params = [];
    
    if (category_id) {
      conditions.push('c.category_id = ?');
      params.push(category_id);
    }
    
    if (search) {
      conditions.push('(c.name LIKE ? OR c.command LIKE ? OR c.description LIKE ? OR c.tags LIKE ?)');
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern, searchPattern);
    }
    
    if (favorite === 'true') {
      conditions.push('c.is_favorite = 1');
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY c.usage_count DESC, c.updated_at DESC';
    
    db.all(query, params, (err, commands) => {
      if (err) {
        console.error('获取命令列表失败:', err);
        return res.status(500).json({
          success: false,
          error: '获取命令列表失败'
        });
      }

      res.json({
        success: true,
        data: commands
      });
    });
  } catch (error) {
    console.error('获取命令列表失败:', error);
    res.status(500).json({
      success: false,
      error: '获取命令列表失败'
    });
  }
});

// 获取单个命令
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const db = req.app.locals.db;
    
    const query = `
      SELECT c.*, cat.name as category_name, cat.color as category_color
      FROM commands c
      LEFT JOIN categories cat ON c.category_id = cat.id
      WHERE c.id = ?
    `;

    db.get(query, [id], (err, command) => {
      if (err) {
        console.error('获取命令失败:', err);
        return res.status(500).json({
          success: false,
          error: '获取命令失败'
        });
      }

      if (!command) {
        return res.status(404).json({
          success: false,
          error: '命令不存在'
        });
      }

      res.json({
        success: true,
        data: command
      });
    });
  } catch (error) {
    console.error('获取命令失败:', error);
    res.status(500).json({
      success: false,
      error: '获取命令失败'
    });
  }
});

// 创建新命令
router.post('/', (req, res) => {
  try {
    const { error, value } = commandSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }
    
    const db = req.app.locals.db;
    const { name, command, description, category_id, tags } = value;
    
    const insertQuery = `
      INSERT INTO commands (name, command, description, category_id, tags)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.run(insertQuery, [name, command, description || '', category_id, tags || ''], function(err) {
      if (err) {
        console.error('创建命令失败:', err);
        return res.status(500).json({
          success: false,
          error: '创建命令失败'
        });
      }

      // 获取创建的命令
      const getQuery = `
        SELECT c.*, cat.name as category_name, cat.color as category_color
        FROM commands c
        LEFT JOIN categories cat ON c.category_id = cat.id
        WHERE c.id = ?
      `;

      db.get(getQuery, [this.lastID], (err, newCommand) => {
        if (err) {
          console.error('获取新创建的命令失败:', err);
          return res.status(500).json({
            success: false,
            error: '创建命令失败'
          });
        }

        res.status(201).json({
          success: true,
          data: newCommand
        });
      });
    });
  } catch (error) {
    console.error('创建命令失败:', error);
    res.status(500).json({
      success: false,
      error: '创建命令失败'
    });
  }
});

// 更新命令
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = updateCommandSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }
    
    const db = req.app.locals.db;
    
    // 检查命令是否存在
    db.get('SELECT id FROM commands WHERE id = ?', [id], (err, command) => {
      if (err) {
        console.error('检查命令存在性失败:', err);
        return res.status(500).json({
          success: false,
          error: '更新命令失败'
        });
      }

      if (!command) {
        return res.status(404).json({
          success: false,
          error: '命令不存在'
        });
      }

      // 构建更新查询
      const updateFields = [];
      const params = [];

      Object.keys(value).forEach(key => {
        updateFields.push(`${key} = ?`);
        params.push(value[key]);
      });

      updateFields.push('updated_at = CURRENT_TIMESTAMP');
      params.push(id);

      const updateQuery = `
        UPDATE commands
        SET ${updateFields.join(', ')}
        WHERE id = ?
      `;

      db.run(updateQuery, params, function(err) {
        if (err) {
          console.error('更新命令失败:', err);
          return res.status(500).json({
            success: false,
            error: '更新命令失败'
          });
        }

        // 获取更新后的命令
        const getQuery = `
          SELECT c.*, cat.name as category_name, cat.color as category_color
          FROM commands c
          LEFT JOIN categories cat ON c.category_id = cat.id
          WHERE c.id = ?
        `;

        db.get(getQuery, [id], (err, updatedCommand) => {
          if (err) {
            console.error('获取更新后的命令失败:', err);
            return res.status(500).json({
              success: false,
              error: '更新命令失败'
            });
          }

          res.json({
            success: true,
            data: updatedCommand
          });
        });
      });
    });
  } catch (error) {
    console.error('更新命令失败:', error);
    res.status(500).json({
      success: false,
      error: '更新命令失败'
    });
  }
});

// 删除命令
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const db = req.app.locals.db;
    
    db.run('DELETE FROM commands WHERE id = ?', [id], function(err) {
      if (err) {
        console.error('删除命令失败:', err);
        return res.status(500).json({
          success: false,
          error: '删除命令失败'
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          success: false,
          error: '命令不存在'
        });
      }

      res.json({
        success: true,
        message: '命令删除成功'
      });
    });
  } catch (error) {
    console.error('删除命令失败:', error);
    res.status(500).json({
      success: false,
      error: '删除命令失败'
    });
  }
});

// 增加使用次数
router.post('/:id/use', (req, res) => {
  try {
    const { id } = req.params;
    const db = req.app.locals.db;
    
    const updateQuery = `
      UPDATE commands
      SET usage_count = usage_count + 1, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    db.run(updateQuery, [id], function(err) {
      if (err) {
        console.error('更新使用次数失败:', err);
        return res.status(500).json({
          success: false,
          error: '更新使用次数失败'
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          success: false,
          error: '命令不存在'
        });
      }

      res.json({
        success: true,
        message: '使用次数已更新'
      });
    });
  } catch (error) {
    console.error('更新使用次数失败:', error);
    res.status(500).json({
      success: false,
      error: '更新使用次数失败'
    });
  }
});

module.exports = router;
