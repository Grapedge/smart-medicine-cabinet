# 设备

## 定义

智能药品柜中使用到的传感器（Sensor）、药品柜（Cabinet）、柜前终端（Terminal）统称为设备（Device）。

设备如果想要接入智能药品柜系统，首先需要在系统中注册设备。

## 用例

```plantuml
@startuml
left to right direction
actor 用户 as U
actor 设备 as D

U --> (注册设备)
U --> (修改设备)
U --> (删除设备)
U --> (查询设备)
D --> (智能药品柜系统鉴权)
@enduml
```

## 设备注册

```plantuml
@startuml
actor 用户 as User
participant 设备注册系统 as DS
participant 设备 as D

User ->  DS : 提供设备 MAC 地址、设备类型，注册设备
DS -> User : 设备访问密钥 SECRET
User -> D : 在设备中录入密钥
@enduml
```

## 设备访问智能药品柜系统

设备凭借 `MAC` 与 `SECRET` 进行 HTTP Basic 认证。

## 设备管理

用户凭借产品 `MAC` 与 `SECRET` 可以重新生成设备密钥。

```plantuml
@startuml
actor 用户 as User
participant 设备注册系统 as DS
participant 设备 as D

User ->  DS : 提供设备 MAC 、SECRET
DS -> User : 新的设备访问密钥 SECRET
User -> D : 在设备中录入密钥
@enduml
```

## 模式

```plantuml
@startuml
entity 设备 {
  mac
  secret
  name
}

note right of 设备::name
  名字可以用于助记设备
end note
@enduml
```