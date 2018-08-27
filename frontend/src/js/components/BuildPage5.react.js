import React, { Component } from 'react';
import jQuery from 'jquery';
import { Tag, Modal, Transfer, Popover, Icon, Button, Input, InputNumber, Checkbox } from 'antd';
const CheckboxGroup = Checkbox.Group;
import Data from '../services/Data';
import Build from '../services/Build';

/**
 * @Author: Golion
 * Build Page 5 装备与道具
 */
class BuildPage5 extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      mockData: [],
      targetKeys: [],
      originalObjModal: {
        showModal: false,
        title: ''
      },
      refresh: false // 用于页面刷新
    };
  }

  componentDidMount() {
    this.getMock.bind(this)();
    if (wp.base.BROWSER_TYPE) { jQuery(".ant-transfer-list-header-title").css("display", "none"); }
  }

  componentDidUpdate() {
    if (wp.base.BROWSER_TYPE) { jQuery(".ant-transfer-list-header-title").css("display", "none"); }
  }

  getMock() {
    const targetKeys = [];
    const mockData = [];
    const storagedTargetKeys = Data.getItem("equip-class-target-keys").split(",");
    for (let i=0; i<Data.getItem('equip-class-list').length; i++) {
      let hasKey = false;
      for (let j=0; j<storagedTargetKeys.length; j++) {
        if (storagedTargetKeys[j] === "") continue;
        if (parseInt(storagedTargetKeys[j]) === i) {
          hasKey = true;
          break;
        }
      }
      const data = {
        key: i,
        title: Data.getItem('equip-class-list')[i],
        description: Data.getItem('equip-class-list')[i],
        chosen: hasKey
      };
      mockData.push(data);
      if (hasKey) targetKeys.push(data.key);
    }
    this.setState({ mockData, targetKeys });
  }

  _handleChangeEquipClassTransfer(targetKeys) {
    Data.setItem("custom-equips", "");
    Data.setItem("extra-equips", "");
    Data.setItem("equip-class-target-keys", targetKeys.join(","));
    this.setState({ targetKeys });
  }

  _changeItems(checkedValues) {
    Data.setItem("custom-items", checkedValues.join(","));
    this.setState({refresh: true});
  }

  _changeEquips(checkedValues) {
    Data.setItem("custom-equips", checkedValues.join(","));
    this.setState({refresh: true});
  }

  _inArray(value, array) {
    for (let i=0; i<array.length; i++) {
      if (array[i] === value) return true;
    }
    return false;
  }

  _changeExtraEquip(classId, equipId, add = true) {
    return () => {
      Build.setExtraEquipAmount(classId, equipId, add);
      this.setState({refresh: true});
    }
  }

  // index=-1: 添加
  // index>=0: 编辑
  _openOriginalObjModal(index) {
    let _this = this;
    return () => {
      if (index < 0) {
        _this.setState({
          originalObjModal: {
            showModal: true,
            mode: 'add',
            title: '新建原创物品',
            name: '',
            weight: 0.0,
            price: 0,
            displayPrice: Build.getPriceDescription(0),
          }
        });
      } else {
        let originalObjs = Data.getItem("original-objs").split(",");
        let originalObj = Build.parseOriginalObj(originalObjs[index]);
        _this.setState({
          originalObjModal: {
            showModal: true,
            mode: 'edit',
            title: '编辑原创物品',
            name: originalObj.name,
            weight: originalObj.weight,
            price: originalObj.price,
            displayPrice: originalObj.displayPrice,
            index: index
          }
        });
      }
    }
  }

  _closeOriginalObjModal() {
    this.setState({
      originalObjModal: {
        showModal: false,
        title: ''
      }
    });
  }

  _changeOriginalObjModalProp(prop) {
    let _this = this;
    return (e) => {
      let newModal = _this.state.originalObjModal;
      if (typeof(e.target) !== "undefined") {
        newModal[prop] = e.target.value;
      } else {
        newModal[prop] = e;
      }
      if (prop === "price") {
        newModal["displayPrice"] = Build.getPriceDescription(newModal["price"]);
      }
      _this.setState({
        originalObjModal: newModal
      });
    }
  }

  _submitOriginalObjModal() {
    let modalData = this.state.originalObjModal;
    if (modalData.mode === "add") {
      Build.addOriginalObj(modalData.name, modalData.weight, modalData.price);
    }
    if (modalData.mode === "edit") {
      Build.editOriginalObj(modalData.index, modalData.name, modalData.weight, modalData.price);
    }
    this._closeOriginalObjModal.bind(this)();
  }

  _deleteOriginalObjModal() {
    let modalData = this.state.originalObjModal;
    Build.deleteOriginalObj(modalData.index);
    this._closeOriginalObjModal.bind(this)();
  }

  render() {

    let finalEquipList = [];
    let finalItemList = [];
    let shoppingCart = [];

    let equipInfo = Build.getEquipInfo(this.state.targetKeys);
    let selectedEquipClasses = equipInfo.equipClasses;
    let selectedEquips = equipInfo.equips;
    let customEquips = Data.getItem("custom-equips").split(",");
    let customItems = Data.getItem("custom-items").split(",");

    let priceSum = 0;
    let weightSum = 0.0;
    // 遍历已选装备列表
    for (let i=0; i<selectedEquips.length; i++) {
      if (this._inArray(selectedEquips[i].name, customEquips)) {
        let classId = selectedEquips[i].classid;
        let equipId = selectedEquips[i].equipid;
        let equipName = Build.getEquipName(classId, equipId);
        let extraAmount = Build.getExtraEquipAmount(classId, equipId);
        let minusAble = extraAmount > 0;
        priceSum += Build.getEquipPriceNumber(classId, equipId) * ( extraAmount + 1 );
        weightSum += Build.getEquipWeightNumber(classId, equipId) * ( extraAmount + 1 );
        shoppingCart.push(
          <div style={{margin:5}}>
            { minusAble ? (
              <Button style={{width:30}} size="small" onClick={ this._changeExtraEquip(classId, equipId, false).bind(this) }>-</Button>
            ) : (
              <div style={{display:"inline-block",width:30,height:22}}/>
            )}
            <div style={{display:"inline-block",margin:5,width:200,fontSize:"small"}}>
              <span style={{color:"red"}}>{ equipName }</span>
              <span> - 数量：</span>
              <span style={{color:"red"}}>{ extraAmount + 1 }</span>
            </div>
            <Button style={{width:30}} size="small" onClick={ this._changeExtraEquip(classId, equipId, true).bind(this) }>+</Button>
          </div>
        );
        finalEquipList.push(equipName + "|" + ( extraAmount + 1 ));
      }
    }
    // 遍历已选道具列表
    for (let i=0; i<Data.getItem("item").length; i++) {
      if (this._inArray(Data.getItem("item")[i].name, customItems)) {
        let classId = 9999;
        let itemId = i;
        let itemName = Build.getItemName(itemId);
        let extraAmount = Build.getExtraEquipAmount(classId, itemId);
        let minusAble = extraAmount > 0;
        priceSum += Build.getItemPriceNumber(i) * ( extraAmount + 1 );
        weightSum += Build.getItemWeightNumber(i) * ( extraAmount + 1 );
        shoppingCart.push(
          <div style={{margin:5}}>
            { minusAble ? (
              <Button style={{width:30}} size="small" onClick={ this._changeExtraEquip(classId, itemId, false).bind(this) }>-</Button>
            ) : (
              <div style={{display:"inline-block",width:30,height:22}}/>
            )}
            <div style={{display:"inline-block",margin:5,width:200,fontSize:"small"}}>
              <span style={{color:"red"}}>{ itemName }</span>
              <span> - 数量：</span>
              <span style={{color:"red"}}>{ extraAmount + 1 }</span>
            </div>
            <Button style={{width:30}} size="small" onClick={ this._changeExtraEquip(classId, itemId, true).bind(this) }>+</Button>
          </div>
        );
        finalItemList.push(itemName + "|" + ( extraAmount + 1 ));
      }
    }
    // 遍历自定义物品列表
    let originalObjList = [];
    if (Data.getItem("original-objs").trim() !== "") {
      let originalObjs = Data.getItem("original-objs").split(",");
      for (let i=0; i<originalObjs.length; i++) {
        let index = i;
        let originalObj = Build.parseOriginalObj(originalObjs[i]);
        originalObjList.push(
          <Tag
            style={{ margin: 5 }}
            onClick={ this._openOriginalObjModal(index).bind(this) }>{ originalObj.name }
          </Tag>
        );
        priceSum += originalObj.price;
        weightSum += originalObj.weight;
      }
    }

    Data.setItem("price-sum", priceSum);
    Data.setItem("weight-sum", weightSum);
    Data.setItem("final-equips", finalEquipList.join(","));
    Data.setItem("final-items", finalItemList.join(","));
    let modalData = this.state.originalObjModal;

    return (
      <div>
        <Modal
          title={ modalData.title }
          visible={ modalData.showModal }
          onCancel={ this._closeOriginalObjModal.bind(this) }
          footer={ null }
        >
          <div style={{ marginBottom: 5}}>
            名称:
            <Input
              style={{ width: 200, marginLeft: 10 }} value={ modalData.name }
              onChange={ this._changeOriginalObjModalProp("name").bind(this) } />
          </div>
          <div style={{ marginBottom: 5}}>
            重量:
            <InputNumber
              style={{ width: 200, marginLeft: 10 }} min={ 0 } step={ 0.01 } value={ modalData.weight }
              onChange={ this._changeOriginalObjModalProp("weight").bind(this) } />
            KG
          </div>
          <div style={{ marginBottom: 5}}>
            价格:
            <InputNumber
              style={{ width: 200, marginLeft: 10 }} min={ 0 } value={ modalData.price }
              onChange={ this._changeOriginalObjModalProp("price").bind(this) } />
            ={ modalData.displayPrice }
          </div>
          <div>
            <Button
              type="primary"
              onClick={ this._submitOriginalObjModal.bind(this) }>
              提交
            </Button>
            { modalData.mode === "edit" ? (
              <Button
                type="primary"
                style={{ marginLeft: 10 }}
                onClick={ this._deleteOriginalObjModal.bind(this) }>
                删除
              </Button>
            ) : (<noscript/>)}
          </div>
        </Modal>
        <p>装备类型列表</p>
        <Transfer
          listStyle={{
            width: wp.base.BROWSER_TYPE?100:200,
            height: wp.base.BROWSER_TYPE?300:400,
            textAlign: "left"
          }}
          dataSource={ this.state.mockData }
          targetKeys={ this.state.targetKeys }
          onChange={ this._handleChangeEquipClassTransfer.bind(this) }
          render={item => item.title}
        />
        { selectedEquipClasses.length > 0 ? (
          <div style={{margin:"10px 0"}}>
            <p>
              <span>选中的装备类型：</span>
              <span style={{color:"red"}}>{ selectedEquipClasses.join(", ") }</span>
            </p>
            <CheckboxGroup
              style={{margin:10}}
              options={ selectedEquips.map((s, i) => ({
                label: (
                  <Popover
                    overlayStyle={{width:250}}
                    content={ ( <div><p>{ Build.getEquipDescription(s.classid, s.equipid) }</p><p>{ Build.getEquipPrice(s.classid, s.equipid) }</p><p>{ Build.getEquipWeight(s.classid, s.equipid) }</p></div> ) }
                    title={ s.name }
                  >
                    <span>{ s.name }</span>
                  </Popover>
                ),
                value: s.name
              }))}
              value={ customEquips }
              onChange={ this._changeEquips.bind(this) }
            />
          </div>
        ) : (
          <noscript/>
        )}
        <div style={{margin:"10px 0"}}>
          <hr/>
        </div>
        <p>常用冒险道具</p>
        <CheckboxGroup
          style={{margin:10}}
          options={ Data.getItem("item-list").map((s, i) => ({
            label: (
              <Popover
                overlayStyle={{width:250}}
                content={ ( <div><p>{ Build.getItemPrice(i) }</p><p>{ Build.getItemWeight(i) }</p></div> ) }
                title={ s }
              >
                <span>{ s }</span>
              </Popover>
            ),
            value: s
          }))}
          value={ customItems }
          onChange={ this._changeItems.bind(this) }
        />
        <div style={{margin:"10px 0"}}>
          <hr/>
        </div>
        { shoppingCart.length > 0 ? (
          <div>
            <p><Icon type="shopping-cart" style={{marginRight:5}}/>购物车</p>
            { shoppingCart }
            <div style={{margin:"10px 0"}}>
              <hr/>
            </div>
          </div>
        ) : ( <noscript/> )}
        <p>自定义装备/道具<Button type="primary" style={{ marginLeft: 10 }} onClick={ this._openOriginalObjModal(-1).bind(this) }>添加</Button></p>
        { originalObjList }
        <div style={{margin:"10px 0"}}>
          <hr/>
        </div>
        <p style={{fontSize:"small"}}>1大金币 = 2中金币 = 10小金币 = 100大银币 = 200中银币 = 1000小银币 = 10000铜币</p>
        <p>
          <span>总金额：</span>
          <span style={{color:"red"}}>{ Build.getPriceDescription(priceSum) }</span>
          <span style={{marginLeft:20}}>总负重：</span>
          <span style={{color:"red"}}>{ weightSum }</span>
          <span>KG</span>
        </p>
      </div>
    );
  }

}

export default BuildPage5;
