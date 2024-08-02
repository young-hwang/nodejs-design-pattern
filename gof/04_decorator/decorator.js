function logExecution(target, key, descriptor) {
  const originalMethod = descriptor.value

  descriptor.value = function (...args) {
    console.log(`Executing ${key} with arguments: ${JSON.stringify(args)}`)
    const result = originalMethod.apply(this, args)
    console.log(`Result: ${result}`)
    return result
  }

  return descriptor
}

class ParentClass {
  greet(name) {
    return `Hello, ${name}`
  }
}

class ChildClass extends ParentClass {
  greet(name) {
    const descriptor = {
      value: super.greet
    }
    const decoratedDescriptor = logExecution(this, 'greet', descriptor)
    const decoratedMethod = decoratedDescriptor.value.bind(this)

    const parentGreeting = decoratedMethod(name)
    return `${parentGreeting}. Welcome to the ChildClass!`
  }
}

// 사용 예제
const child = new ChildClass()
console.log(child.greet('Alice'))
