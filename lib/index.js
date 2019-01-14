import NP from 'number-precision'

const LEVEL = {
    "+": 1,
    "-": 1,
    "*": 2,
    "/": 2
}

const NP_METHOD = {
    "+": 'plus',
    "-": 'minus',
    "*": 'times',
    "/": 'divide'
}

// 比较操作符优先级
function compare(p1, p2) {
    return LEVEL[p1] >= LEVEL[p2]
}

// 表达式字符串转数组
function expStr2Arr(exp) {
    exp = exp.replace(/\s/g, '')
    const REG = /[\*|/|\+|\-|\(|\)]/
    const res = []
    let execRes = null
    while ((execRes = REG.exec(exp))) {
        let num = exp.slice(0, execRes.index)
        if (num || `${num}` === '0') {
            res.push(num)
        }
        res.push(exp.slice(execRes.index, execRes.index + 1))
        exp = exp.slice(execRes.index + 1)
    }
    if (exp.length > 0) {
        res.push(exp)
    }
    return res
}

// 逆波兰表达式
function reversePolish(exp) {
    exp = expStr2Arr(exp)
    const stack = []
    const res = []
    function transform() {
        if (exp.length === 0) {
            while (stack.length > 0) {
                res.push(stack.pop())
            }
        } else {
            const elem = exp.shift()
            if (/\d/.test(elem)) { // 操作数 -> 输出
                res.push(elem)
            } else if (elem === '(') { // 左括号 -> 入栈
                stack.push(elem)
            } else if (elem === ')') { // 右括号 -> 栈元素出栈，直到第一个左括号
                while (stack[stack.length - 1] !== '(') {
                    res.push(stack.pop())
                }
                stack.pop()
            } else if (compare(stack[stack.length - 1], elem)) { // 栈顶元素优先级较高，出栈直到第一个优先级较低的元素
                while (compare(stack[stack.length - 1], elem)) {
                    res.push(stack.pop())
                }
                stack.push(elem)
            } else { // 优先级高于栈顶元素 -> 入栈
                stack.push(elem)
            }
            transform()
        }
    }
    transform()
    return res
}

function calculate(exp) {
    const rp = reversePolish(exp)
    const stack = []
    while (rp.length > 0) {
        let elem = rp.shift()
        if (/\d/.test(elem)) {
            stack.push(elem)
        } else {
            let n1 = stack.pop()
            let n2 = stack.pop()
            stack.push(NP[NP_METHOD[elem]](n2, n1))
        }
    }
    return stack.pop()
}

export default calculate