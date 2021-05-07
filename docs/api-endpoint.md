# API 端点

## 用户

- 添加用户：POST /user
- 获取用户列表：GET /user?current=1&pageSize=10&sort=createdAt:desc
- 删除用户：DELETE /user/:id
- 修改用户：PUT /user/:id
- 获取用户信息：GET /user/:id

## 鉴权

- 用户登录：POST /auth/sign-in

## 药品柜

- 添加药品柜：POST /cabinet
- 删除药品柜：DELETE /cabinet/:id
- 授权用户访问药品柜：POST /cabinet/:id/auth/:phone
- 取消授权用户访问药品柜：DELETE /cabinet/:id/auth/:phone

- 绑定传感器：POST /cabinet/:id/sensor
- 查看传感器：GET /cabinet/:id/sensor/:mac?from=2021-03-16&to=2021-04-08

- 放入药品：POST /cabinet/:id/medicine

```json
{
  "medicineId": "string",
  "count": 1,
}
```

- 拿出药品：DELETE /cabinet/:id/medicine/:medicine-id?count=1
- 查看柜内药品：GET /cabinet/medicine?current=0&pageSize=10&sort=updatedAt:desc

- 设置报警界限 POST /cabinet/:id/alarm/limit
- 查看报警界限 GET /cabinet/:id/alarm/limit
- 查看报警信息 GET /cabinet/:id/alarm

## 传感器

- 添加传感器 POST /sensor
- 删除传感器 DELETE /sensor/:id
- 上传传感器数据（BASIC认证）POST /sensor/:id
- 查看传感器数据： /sensor/:id

## 药品

- 添加药品 POST /medicine
- 删除药品 DELETE /medicine/:id
- 修改药品 PUT /medicine/:id
- 查询药品 GET /medicine/:id
- 查看药品 GET /medicine?current=1&pageSize=10&sort=updatedAt:desc
