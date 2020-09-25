
class Observer {
    constructor(data) {
        this.walk(data)
    }
    walk (data) { // 循环执行data
        if (!data || typeof data !== 'object') {
            return
        }
        Object.keys(data).forEach(key => {
            this.defineReactive(data, key, data[key])
        })
    }
    defineReactive (obj, key, val) { // 将data属性转成getter\setter
        let that = this
        this.walk(val) // 如果val是对象，把内部也具有get\set
        let dep = new Dep() // 负责收集依赖，并发送通知
        Object.defineProperty(obj, key, {
            configurable: true,
            enumerable: true,
            get() {
                Dep.target && dep.addSub(Dep.target) // 收集依赖
                return val // 如果使用obj[key]，会变成死循环
            },
            set(newValue) {
                if (newValue === val) {
                    return
                }
                val = newValue
                that.walk(newValue) // 修改后可能是对象，set函数内部调用，修改了this指向
                dep.notify() // 发送通知
            }
        })
    }
}
