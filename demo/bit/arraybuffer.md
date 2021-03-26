# 

ArrayBuffer 数组形式的缓存

TypedArray 类型化数组

DataView  数据视图

TypedArray 一共有 9 种

| 类型                | 字节  | 含义                | 对应的 C 语言类型     |
| ----------------- | --- | ----------------- | -------------- |
| Int8Array         | 1   | 8 位带符号整数          | signed char    |
| Uint8Array        | 1   | 8 位不带符号整数         | unsigned char  |
| Uint8ClampedArray | 1   | 8 位不带符号整数（自动过滤溢出） | unsigned char  |
| Int16Array        | 2   | 16 位带符号整数         | short          |
| Uint16Array       | 2   | 16 位不带符号整数        | unsigned short |
| Int32Array        | 4   | 32 位带符号整数         | int            |
| Uint32Array       | 4   | 32 位不带符号的整数       | unsigned int   |
| Float32Array      | 4   | 32 位浮点数           | float          |
| Float64Array      | 8   | 64 位浮点数           | double         |

`DataView` 支持除 `Uint8C` 以外的其他 8 种

`ArrayBuffer` 是内存中二进制数据的一段，不能直接读写，只能通过 `DataView` 或 `TypedArray` 来读写

```javascript
    arrayBuffer = new ArrayBuffer(32)
    dataView = new DataView(arrayBuffer)

    uint8data = dataView.getUint8(1) 
    // 0
```

```javascript
    uint8Array = new Uint8Array([0, 1, 2])
    uint8Array[0] = 3 
    // [ 3, 1, 2 ]
```

---

```javascript
    arrayBuffer = new ArrayBuffer(16)
    int32Array = new Int32Array(arrayBuffer)

    int32Array.set([0, 1, 2, 3])
    int16Array = new Int16Array(arrayBuffer))
    // [ 0, 0, 1, 0, 2, 0, 3, 0 ]
```

16字节，分别以 32 位和 16 位进行读取，x86 计算机采用小端字节序

TypedArray 无法处理大端字节序

## DataView

```javascript
    dataView = new DataView(arrayBuffer)
    int32data = dataView.getInt32(8, 11, true)
    // 2
    dataView.setInt32(0, 4, true)
    // [ 4, 1, 2, 3 ]
```

true 小端，默认大端

## 复合视图

```javascript
    const buffer = new ArrayBuffer(24)

    const idView = new Uint32Array(buffer, 0, 1)
    const usernameView = new Uint8Array(buffer, 4, 16)
    float32Array = new Float32Array(buffer, 20, 1)
```
