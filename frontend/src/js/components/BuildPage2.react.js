import React, { Component } from 'react';
import { Select, InputNumber, Radio } from 'antd';
const RadioGroup = Radio.Group;
const Option = Select.Option;
import Build from '../services/Build';
import Data from '../services/Data';

/**
 * @Author: Golion
 * Build Page 2 基础数值
 */
class BuildPage2 extends Component {

  render() {
    let paramPoints1 = Build.getRemainParamPoints();
    let paramPoints2 = Build.getRemainParamPoints(false);
    let paramPoints3 = Build.getXPParamPoints();
    if (paramPoints1 < 0) {
      paramPoints3 += paramPoints1;
      paramPoints1 = 0;
    }
    if (paramPoints2 < 0) {
      paramPoints3 += paramPoints2;
      paramPoints2 = 0;
    }
    return (
      <div>
        <div style={{margin:10}}>
          <Select style={{width:80}} defaultValue={ Data.getItem("race-list-select") } onChange={ this.props.changeRace }>
            { Data.getItem("race-list").map((s, i) => <Option value={ s }>{ s }</Option>) }
          </Select>
          <span style={{marginLeft:20}}>XP：</span>
          <InputNumber min={0} max={1000} value={ Data.getNumberItem("params-xp") } onChange={ this.props.setItemDirect("params-xp") } />
        </div>
        <p>{ Data.getItem("current-race").description }</p>
        { Data.getItem("current-race").bonus.length > 0 ? (
          <div style={{margin:10}}>
            { Data.getItem("current-race").bonus.map((s, i) => <p style={{fontSize:"small",margin:"5"}}>{ s }</p>) }
          </div>
        ) : (
          <noscript/>
        )}
        <hr/>
        <div style={{margin:10}}>
          <RadioGroup style={{textAlign:"left"}} onChange={ this.props.setItem("params-radio") } value={ Data.getItem("params-radio") }>
            <Radio style={{display:"block"}} key="a" value="a">1.	获得+2表属性点，并且角色获得《魔法相性：表》</Radio>
            <Radio style={{display:"block"}} key="b" value="b">2.	获得+2里属性点，并且角色获得《魔法相性：里》</Radio>
            <Radio style={{display:"block"}} key="c" value="c">3.	获得+1表属性点和+1里属性点</Radio>
            <Radio style={{display:"block"}} key="d" value="d">4.	不获得额外的属性点，改为获得额外的+6能力点</Radio>
          </RadioGroup>
        </div>
        <div>
          <p>
            <span >表属性点：</span>
            <span>{ paramPoints1 }</span>
            <div className="mobile-clear-both"/>
            <span style={wp.base.BROWSER_TYPE?{}:{marginLeft:20}}>里属性点：</span>
            <span>{ paramPoints2 }</span>
            <div className="mobile-clear-both"/>
            <span style={wp.base.BROWSER_TYPE?{}:{marginLeft:20}}>XP属性点：</span>
            <span style={paramPoints3>=0?{}:{color:"red"}}>{ paramPoints3 }</span>
          </p>
        </div>
        <div style={{margin:10}}>
          <span style={{marginRight:5}}>表属性：</span>
          <div className="mobile-clear-both"/>
          <span style={{marginLeft:5}}>智力 </span>
          <InputNumber min={ Data.getItem("current-race").minParams[0] } max={ Data.getItem("current-race").maxParams[0] } value={ Data.getItem("params-int") } onChange={ this.props.setItemDirect("params-int") } />
          <div className="mobile-clear-both"/>
          <span style={{marginLeft:5}}>力量 </span>
          <InputNumber min={ Data.getItem("current-race").minParams[1] } max={ Data.getItem("current-race").maxParams[1] } value={ Data.getItem("params-str") } onChange={ this.props.setItemDirect("params-str") } />
          <div className="mobile-clear-both"/>
          <span style={{marginLeft:5}}>灵巧 </span>
          <InputNumber min={ Data.getItem("current-race").minParams[2] } max={ Data.getItem("current-race").maxParams[2] } value={ Data.getItem("params-agi") } onChange={ this.props.setItemDirect("params-agi") } />
          <div className="mobile-clear-both"/>
          <span style={{marginLeft:5}}>体魄 </span>
          <InputNumber min={ Data.getItem("current-race").minParams[3] } max={ Data.getItem("current-race").maxParams[3] } value={ Data.getItem("params-vit") } onChange={ this.props.setItemDirect("params-vit") } />
          <div className="mobile-clear-both"/>
          <span style={{marginLeft:5}}>仪态 </span>
          <InputNumber min={ Data.getItem("current-race").minParams[4] } max={ Data.getItem("current-race").maxParams[4] } value={ Data.getItem("params-crm") } onChange={ this.props.setItemDirect("params-crm") } />
          <div className="mobile-clear-both"/>
        </div>
        <div style={{margin:10}}>
          <span style={{marginRight:5}}>里属性：</span>
          <div className="mobile-clear-both"/>
          <span style={{marginLeft:5}}>沉着 </span>
          <InputNumber min={ Data.getItem("current-race").minParams[5] } max={ Data.getItem("current-race").maxParams[5] } value={ Data.getItem("params-cal") } onChange={ this.props.setItemDirect("params-cal") } />
          <div className="mobile-clear-both"/>
          <span style={{marginLeft:5}}>气势 </span>
          <InputNumber min={ Data.getItem("current-race").minParams[6] } max={ Data.getItem("current-race").maxParams[6] } value={ Data.getItem("params-pow") } onChange={ this.props.setItemDirect("params-pow") } />
          <div className="mobile-clear-both"/>
          <span style={{marginLeft:5}}>敏锐 </span>
          <InputNumber min={ Data.getItem("current-race").minParams[7] } max={ Data.getItem("current-race").maxParams[7] } value={ Data.getItem("params-dex") } onChange={ this.props.setItemDirect("params-dex") } />
          <div className="mobile-clear-both"/>
          <span style={{marginLeft:5}}>坚毅 </span>
          <InputNumber min={ Data.getItem("current-race").minParams[8] } max={ Data.getItem("current-race").maxParams[8] } value={ Data.getItem("params-for") } onChange={ this.props.setItemDirect("params-for") } />
          <div className="mobile-clear-both"/>
          <span style={{marginLeft:5}}>操控 </span>
          <InputNumber min={ Data.getItem("current-race").minParams[9] } max={ Data.getItem("current-race").maxParams[9] } value={ Data.getItem("params-con") } onChange={ this.props.setItemDirect("params-con") } />
          <div className="mobile-clear-both"/>
        </div>
      </div>
    );
  }

}

export default BuildPage2;
