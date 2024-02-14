export const getData=(str)=> JSON.parse(localStorage.getItem(str))

export const setData=(str,data)=> localStorage.setItem(str,JSON.stringify(data))

export let formater=(str)=>{
    let arr=str.split(" ")
    console.log(arr)
    arr=arr.filter((item)=>{
        return item!=""
    })
    str=arr.join(" ")
    return str
}