import service from "@/plugins/request"

export function getSignList (page = 1, pageSize = 10, data) {
  const formData = new FormData()
  formData.append('activityName', data.activityName)
  formData.append('trueName', data.trueName)
  formData.append('depName', data.depName)
  formData.append('signStartTime', data.signStartTime)
  formData.append('signEndTime', data.signEndTime)
  return service({
    url: `/signIn/signInList/${page}/${pageSize}`,
    method: 'post',
    data: formData
  })
}

export function exportExcel (data) {
  const formData = new FormData()
  formData.append('activityName', data.activityName)
  formData.append('trueName', data.trueName)
  formData.append('depName', data.depName)
  return service({
    url: '/signIn/export',
    method: 'post',
    data: formData,
    responseType: 'blob'
  })
}