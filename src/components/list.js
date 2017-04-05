/**
 * Created by zhangyuan on 17/4/4.
 */

import React, { Component } from 'react';
import {
    Text,
    View,
    ListView,
    RefreshControl,
    StyleSheet
} from 'react-native';
import { List, ListItem } from 'react-native-elements';

import IndexAction from 'IndexAction';
import IndexStore from 'IndexStore';
import Consts from 'Consts';
import Util from 'Util';

export default class IList extends Component {

  constructor(props) {
    super(props);

    console.log('keyword: ' + this.props.keyWord);

    this.state = {
      keyWord: this.props.keyWord,
      dataSource: new ListView.DataSource({
        //rowHasChanged: (r1, r2) => r1.article_id !== r2.article_id
        rowHasChanged: (r1, r2) => true
      }),
      currentSize: Number.MAX_VALUE,
      limit: 0,
      page: 0,
      loading: false,//控制Request请求是否加载完毕
      status: 0// 控制foot， 0：隐藏foot  1：已加载完成   2 ：显示加载中
    };
  }

  componentWillMount() {
    IndexStore.addListener(Consts.KEY_EVENT_CHANGE, this.__freshPage.bind(this));
  }

  componentDidMount() {
    IndexAction.getList(++this.state.page, this.state.keyWord);
  }

  /**
   * runtime
   */
  componentWillReceiveProps(nextProps) {

  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  componentWillUpdate(nextProps, nextState) {

  }

  componentDidUpdate(prevProps, prevState) {

  }

  /**
   * destroy
   */
  componentWillUnmount() {
    IndexStore.removeListener(Consts.KEY_EVENT_CHANGE);
  }

  /**
   * click item
   * @private
   */
  __click(rowData) {
    const { navigate } = this.props.navigation;
    navigate('Detail', {url: rowData.url});
  }

  /**
   *
   * @param data
   * @private
   */
  __renderRow(rowData, sectionID) {
    return (
        <ListItem
            key={rowData.article_id}
            title={rowData.title}
            subtitle={rowData.display_time}
            roundAvatar={false}
            avatar={rowData.thumb}
            onPress={this.__click.bind(this, rowData)}
            />
    )
  }

  /**
   *
   * @private
   */
  __toEnd() {
    if (this.state.currentSize < this.state.limit) {
      console.log('no more...');
      this.state.status == 1;
      return;
    }
    if (this.state.loading) {
      console.log('loading...');
      this.state.status == 2;
      return;
    }
    this.state.loaded = true;
    IndexAction.getList(++this.state.page, this.state.keyWord);
  }

  /**
   *
   * @private
   */
  __renderFooter() {
    const status = this.state.status;
    switch (status) {
      case 1:
        return (<View><Text>loading...</Text></View>);
      case 2:
        return (<View><Text>no more!</Text></View>);
      default :
        return null;
    }
  }

  /**
   *
   * @private
   */
  __onRefresh() {

  }

  __freshPage(data) {
    const {pagination, result} = data;
    const {page, limit} = pagination;
    const currentSize = result.length;
    IndexStore.store(Consts.KEY_STORAGE_CURRENT_PAGE, page);
    this.setState(Util.mix(this.state, {
      status: 0,
      loading: false,
      currentSize,
      page,
      limit,
      dataSource: this.state.dataSource.cloneWithRows(result)
    }));
  }


  render() {
    return (
        <List containerStyle={{marginBottom: 20}}>
          <ListView
              dataSource={ this.state.dataSource }
              renderRow={ this.__renderRow.bind(this) }
              onEndReached={ this.__toEnd.bind(this) }
              onEndReachedThreshold={10}
              renderFooter={ this.__renderFooter.bind(this) }
              enableEmptySections={true}
              refreshControl={
                      <RefreshControl
                          refreshing={ this.state.status === 2 }
                          onRefresh={ this.__onRefresh.bind(this) }
                          tintColor="gray"
                          colors={['#ff0000', '#00ff00', '#0000ff']}
                          progressBackgroundColor="gray"/>
                      }/>
        </List>

    )
  }
}

const styles = StyleSheet.create({
  subtitleView: {
    flexDirection: 'row',
    paddingLeft: 10,
    paddingTop: 5
  },
  ratingImage: {
    height: 19.21,
    width: 100
  },
  ratingText: {
    paddingLeft: 10,
    color: 'grey'
  }
});

