import $ from 'jquery'

interface Option {
  url: string,
  method: string,
  data?: any
}
const baseUrl: string = 'https://wyy.wangpinpin.com'

export const request = (option: Option) => {
  return new Promise((resolve, reject) => {
    let url: string = `${baseUrl}${option.url}`;
    if (url.includes('?') && !url.includes('timestamp')) url.concat(`&timestamp=${new Date().getTime()}`)
    else if (!url.includes('?') && !url.includes('timestamp')) url.concat(`?timestamp=${new Date().getTime()}`)
    $.ajax({
      url,
      method: option.method || 'get',
      data: option.data,
      xhrFields: {
        withCredentials: true, //关键
      },
      timeout: 1000 * 10,
      success: (res: any) => resolve(res),
      error: (error: any) => reject(error)
    })
  })
}

export default request