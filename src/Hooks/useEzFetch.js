import { useReducer, useEffect } from 'react'

import { Platform } from 'react-native'
import getVersion from '../Services/GetVersion'
import AsyncStorage from '@react-native-async-storage/async-storage'
import config from '../../config.js'
// import axios from 'axios'
import isEmpty from 'lodash/isEmpty'
import apisauce from 'apisauce'
import useIsMounted from './useIsMounted'

const versionRelease = Platform.select({
  android: config.versionAndroid,
  ios: config.versionIos
})
const versionCodePush = Platform.select({
  android: config.versionCodePushAndroid,
  ios: config.versionCodePushIos
})
const versionApp = getVersion()
const reducer = (state, action) => {
  switch (action.type) {
    case 'request':
      return {
        ...state,
        fetching: true,
        error: null,
        data: null
      }
    case 'success':
      return {
        ...state,
        fetching: false,
        data: action.data,
        error: null
      }
    case 'failure':
      return {
        ...state,
        fetching: false,
        data: null,
        error: action.error
      }
    case 'custome':
      return {
        ...state,
        ...action.custome
      }
    default: return state
  }
}

const baseUrl = config.developmentENV === 'stg' ? config.stgApiURL : config.apiURL

const api = apisauce.create({
  baseURL: baseUrl,
  headers: {
    'user-agent': Platform.OS,
    'X-Frontend-Type': 'mobile',
    'X-App-Version': versionApp,
    'x-app-codepush-version': versionCodePush,
    'x-app-release-version': versionRelease,
    'x-company-name': 'ODI'
  },
  timeout: 10000
})

const defaultHeader = {
  'user-agent': Platform.OS,
  'x-company-name': 'ODI'
}

const initialData = {
  fetching: false,
  error: null,
  data: null
}

const useEzFetch = (url, initialPayload = initialData) => {
  const [state, dispatch] = useReducer(reducer, initialPayload)
  const isMounted = useIsMounted()
  useEffect(() => {
    if (url) api.setBaseURL(url)
  }, [])

  const getApiOnly = (param) => api.get(`${param}`)

  const get = async (param, headers = {}, callBack) => {
    if (__DEV__) Logger(`REQ-GET-USEEZFETCH-${param}`, {}, state)
    let response, err
    try {
      dispatch({ type: 'request' })
      const header = { ...defaultHeader, ...headers }
      if (header.authorization) {
        const token = await AsyncStorage.getItem('access_token')
        header.authorization = token
      }
      const res = await api.get(`${param}`, {}, { headers: header })
      response = res
      if (isMounted.current) resolved(res)
    } catch (error) {
      err = error
      dispatch({ type: 'failure', error: 'Terjadi Kesalahan Koneksi' })
    } finally {
      if (__DEV__) Logger(`DONE-GET-USEEZFETCH-${param}`, { response, err }, state)
      if (callBack) callBack({ response, err, state })
    }
    return response
  }

  const post = async (param, data = {}, headers = {}, callBack) => {
    if (__DEV__) Logger(`REQ-POST-USEEZFETCH-${param}`, { data }, state)
    let response, err
    try {
      dispatch({ type: 'request' })
      const header = { ...defaultHeader, ...headers }
      if (header.authorization) {
        const token = await AsyncStorage.getItem('access_token')
        header.authorization = token
      }
      const res = await api.post(`${param}`, data, { headers: header })
      response = res
      await resolved(res)
    } catch (error) {
      err = error
      dispatch({ type: 'failure', error: 'Terjadi Kesalahan Koneksi' })
    } finally {
      if (__DEV__) Logger(`DONE-POST-USEEZFETCH-${param}`, { response, err }, state)
      if (callBack) callBack({ response, err, state })
    }
    return response
  }

  const Logger = (title, data, state) => {
    console.groupCollapsed(title)
    // console.group('TIME');
    // console.timeEnd(param);
    // console.groupEnd();
    console.group('FETCH')
    console.log(data)
    console.groupEnd()
    console.group('STATE')
    console.log(state)
    console.groupEnd()
    console.groupEnd()
  }

  const resolved = (res) => {
    if (res.status === 200) {
      if (isEmpty(res.data.error)) {
        const resData = res.data.data
        dispatch({ type: 'success', data: resData })
      } else dispatch({ type: 'failure', error: res.data.message })
    } else if (res.status === 404) dispatch({ type: 'failure', error: res.status })
    else {
      if (isEmpty(res.data.error)) {
        dispatch({ type: 'failure', error: res.data.message })
      } else dispatch({ type: 'failure', error: 'Terjadi Kesalahan Koneksi' })
    }
  }
  const setNewError = (message) => dispatch({ type: 'failure', error: message })

  return { ...state, dispatch, getApiOnly, get, post, setNewError }
}

export default useEzFetch
