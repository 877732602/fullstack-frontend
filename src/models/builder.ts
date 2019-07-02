import { routerRedux } from 'dva/router';
import { Reducer } from 'redux';
import { Effect,Subscription } from 'dva';
import { message } from 'antd';
import { 
  getFieldsAndData,
  submit,
} from '@/services/builder';

export interface ModelType {
  namespace: string;
  state: {};
  subscriptions:{ setup: Subscription };
  effects: {
    getFieldsAndData: Effect;
    submit: Effect;
  };
  reducers: {
    updateState: Reducer<{}>;
  };
}

const Builder: ModelType = {
  namespace: 'builder',

  state: {
    msg: '',
    url: '',
    data: [],
    pagination: [],
    status: '',
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        //打开页面时，进行操作
        console.log('subscriptions');
      });
    },
  },

  effects: {
    *getFieldsAndData({ payload, callback }, { put, call, select }) {
      const response = yield call(getFieldsAndData, payload);
      if (response.status === 'success') {
        yield put({
          type: 'updateState',
          payload: response,
        });

        if (callback && typeof callback === 'function') {
          callback(response); // 返回结果
        }
      }
    },
    *submit({ type, payload }, { put, call, select }) {
      const response = yield call(submit, payload);
      // 操作成功
      if (response.status === 'success') {
        // 提示信息
        message.success(response.msg, 3);
        // 页面跳转
        yield put(
          routerRedux.push({
            pathname: response.url,
          }),
        );
      } else {
        message.error(response.msg, 3);
      }
    },
  },

  reducers: {
    updateState(state, action) {
      return {
        ...action.payload,
      };
    },
  },
};

export default Builder;
