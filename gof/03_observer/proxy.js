const handler = {
  get: function (target, name) {
    return name === 'name' ? `${target.a} ${target.b}` : target[name]
  }
}

let proxy = new Proxy({a: 'YOUNG', b: 'HWANG'}, handler);
console.log(proxy.name)

// Observer pattern 구현
function createReactiveObject(target, callback) {
  const proxy = new Proxy(target, {
    set: function (obj, prop, value) {
      if (value !== obj[prop]) {
        const prev = obj[prop]
        obj[prop] = value
        callback(`${prop}가 [${prev}] >> [${value}]로 변경되었다.`)
      }
    }
  })
  return proxy
}

const a = {
  name: "Young"
}

const b = createReactiveObject(a, console.log)
b.name = "Young"
b.name = "Yong"