export function TMapGL() {
  // if (window.TMap) return Promise.resolve()
  return new Promise(function (resolve, reject) {
    var script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'https://map.qq.com/api/gljs?v=1.exp&libraries=service&key=JYXBZ-3C5CJ-UBRF6-FOPY3-L546H-2BFIS'
    script.onerror = () => reject()
    script.onload = () => resolve()
    document.head.appendChild(script)
  })
}