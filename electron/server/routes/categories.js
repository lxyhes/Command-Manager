const express = require('express');
const Joi = require('joi');
const router = express.Router();

// 验证模式
const categorySchema = Joi.object({
  name: Joi.string().required().min(1).max(50),
  description: Joi.string().allow('').max(200),
  color: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).default('#3B82F6')
});

const updateCategorySchema = Joi.object({
  name: Joi.string().min(1).max(50),
  description: Joi.string().allow('').max(200),
  color: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/)
});

// 获取所有分类
router.get('/', (req, res) => {
  try {
    const db = req.app.locals.db;
    
    const query = `
      SELECT c.*,
             COUNT(cmd.id) as command_count
      FROM categories c
      LEFT JOIN commands cmd ON c.id = cmd.category_id
      GROUP BY c.id
      ORDER BY c.name
    `;

    db.all(query, [], (err, categories) => {
      if (err) {
        console.error('获取分类列表失败:', err);
        return res.status(500).json({
          success: false,
          error: '获取分类列表失败'
        });
      }

      res.json({
        success: true,
        data: categories
      });
    });
  } catch (error) {
    console.error('获取分类列表失败:', error);
    res.status(500).json({
      success: false,
      error: '获取分类列表失败'
    });
  }
});

// 获取单个分类
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const db = req.app.locals.db;

    const query = `
      SELECT c.*,
             COUNT(cmd.id) as command_count
      FROM categories c
      LEFT JOIN commands cmd ON c.id = cmd.category_id
      WHERE c.id = ?
      GROUP BY c.id
    `;

    db.get(query, [id], (err, category) => {
      if (err) {
        console.error('获取分类失败:', err);
        return res.status(500).json({
          success: false,
          error: '获取分类失败'
        });
      }

      if (!category) {
        return res.status(404).json({
          success: false,
          error: '分类不存在'
        });
      }

      res.json({
        success: true,
        data: category
      });
    });
  } catch (error) {
    console.error('获取分类失败:', error);
    res.status(500).json({
      success: false,
      error: '获取分类失败'
    });
  }
});

// 创建新分类
router.post('/', (req, res) => {
  try {
    const { error, value } = categorySchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    const db = req.app.locals.db;
    const { name, description, color } = value;

    // 检查分类名是否已存在
    db.get('SELECT id FROM categories WHERE name = ?', [name], (err, existing) => {
      if (err) {
        console.error('检查分类名失败:', err);
        return res.status(500).json({
          success: false,
          error: '创建分类失败'
        });
      }

      if (existing) {
        return res.status(400).json({
          success: false,
          error: '分类名已存在'
        });
      }

      const insertQuery = `
        INSERT INTO categories (name, description, color)
        VALUES (?, ?, ?)
      `;

      db.run(insertQuery, [name, description || '', color], function(err) {
        if (err) {
          console.error('创建分类失败:', err);
          if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return res.status(400).json({
              success: false,
              error: '分类名已存在'
            });
          } else {
            return res.status(500).json({
              success: false,
              error: '创建分类失败'
            });
          }
        }

        // 获取创建的分类
        const getQuery = `
          SELECT c.*, 0 as command_count
          FROM categories c
          WHERE c.id = ?
        `;

        db.get(getQuery, [this.lastID], (err, newCategory) => {
          if (err) {
            console.error('获取新创建的分类失败:', err);
            return res.status(500).json({
              success: false,
              error: '创建分类失败'
            });
          }

          res.status(201).json({
            success: true,
            data: newCategory
          });
        });
      });
    });
  } catch (error) {
    console.error('创建分类失败:', error);
    res.status(500).json({
      success: false,
      error: '创建分类失败'
    });
  }
});

// 更新分类
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = updateCategorySchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    const db = req.app.locals.db;

    // 检查分类是否存在
    db.get('SELECT id FROM categories WHERE id = ?', [id], (err, category) => {
      if (err) {
        console.error('检查分类存在性失败:', err);
        return res.status(500).json({
          success: false,
          error: '更新分类失败'
        });
      }

      if (!category) {
        return res.status(404).json({
          success: false,
          error: '分类不存在'
        });
      }

      // 如果更新名称，检查是否与其他分类重名
      if (value.name) {
        db.get('SELECT id FROM categories WHERE name = ? AND id != ?', [value.name, id], (err, existing) => {
          if (err) {
            console.error('检查分类名重复失败:', err);
            return res.status(500).json({
              success: false,
              error: '更新分类失败'
            });
          }

          if (existing) {
            return res.status(400).json({
              success: false,
              error: '分类名已存在'
            });
          }

          performUpdate();
        });
      } else {
        performUpdate();
      }

      function performUpdate() {
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
          UPDATE categories
          SET ${updateFields.join(', ')}
          WHERE id = ?
        `;

        db.run(updateQuery, params, function(err) {
          if (err) {
            console.error('更新分类失败:', err);
            if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
              return res.status(400).json({
                success: false,
                error: '分类名已存在'
              });
            } else {
              return res.status(500).json({
                success: false,
                error: '更新分类失败'
              });
            }
          }

          // 获取更新后的分类
          const getQuery = `
            SELECT c.*,
                   COUNT(cmd.id) as command_count
            FROM categories c
            LEFT JOIN commands cmd ON c.id = cmd.category_id
            WHERE c.id = ?
            GROUP BY c.id
          `;

          db.get(getQuery, [id], (err, updatedCategory) => {
            if (err) {
              console.error('获取更新后的分类失败:', err);
              return res.status(500).json({
                success: false,
                error: '更新分类失败'
              });
            }

            res.json({
              success: true,
              data: updatedCategory
            });
          });
        });
      }
    });
  } catch (error) {
    console.error('更新分类失败:', error);
    res.status(500).json({
      success: false,
      error: '更新分类失败'
    });
  }
});

// 删除分类
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const db = req.app.locals.db;

    // 检查是否有命令使用此分类
    db.get('SELECT COUNT(*) as count FROM commands WHERE category_id = ?', [id], (err, result) => {
      if (err) {
        console.error('检查分类使用情况失败:', err);
        return res.status(500).json({
          success: false,
          error: '删除分类失败'
        });
      }

      if (result.count > 0) {
        return res.status(400).json({
          success: false,
          error: '无法删除包含命令的分类，请先移动或删除相关命令'
        });
      }

      db.run('DELETE FROM categories WHERE id = ?', [id], function(err) {
        if (err) {
          console.error('删除分类失败:', err);
          return res.status(500).json({
            success: false,
            error: '删除分类失败'
          });
        }

        if (this.changes === 0) {
          return res.status(404).json({
            success: false,
            error: '分类不存在'
          });
        }

        res.json({
          success: true,
          message: '分类删除成功'
        });
      });
    });
  } catch (error) {
    console.error('删除分类失败:', error);
    res.status(500).json({
      success: false,
      error: '删除分类失败'
    });
  }
});

module.exports = router;
