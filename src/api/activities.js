import request from "@/plugins/request"

export function getActivitiesList(page = 1, pageSize = 10, data) {
  const formData = new FormData()
  formData.append('activityName', data.activityName)
  formData.append('creatUser', data.creatUser)
  formData.append('activityBeginTime', data.activityBeginTime)
  formData.append('activityEndTime', data.activityEndTime)
  return request({
    url: `/signInActivity/activityList/${page}/${pageSize}`,
    method: 'post',
    data: formData
  })
}

export function createActivity(data) {
  const formData = new FormData()
  formData.append('activityName', data.activityName)
  formData.append('activityTime', data.activityTime)
  formData.append('creatUser', data.creatUser)
  formData.append('scanBeginTime', data.scanBeginTime)
  formData.append('scanEndTime', data.scanEndTime)
  return request({
    url: '/signInActivity/creatActivity',
    method: 'post',
    data: formData,
  })
}

export function deleteActivity(id) {
  return request({
    url: `/signInActivity/delActivity/${id}`,
    method: 'delete'
  })
}