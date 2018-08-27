import Data from './Data';

/**
 * @author: Golion
 */
let Build = {

  init(callback) {
    let _this = this;
    // 种族
    Data.loadBuildDataFromServer("race", () => {
      if ((typeof(Data.data["race"].length) === "undefined") || (Data.data["race"].length === 0)) { callback(false); return; }
      Data.data["race-list"] = [];
      for (let i=0; i<Data.data["race"].length; i++) {
        Data.data["race-list"].push(Data.data["race"][i].name);
      }
      // 职业与技能
      Data.loadBuildDataFromServer("profession", () => {
        if ((typeof(Data.data["profession"].length) === "undefined") || (Data.data["profession"].length === 0)) { callback(false); return; }
        Data.data["profession-list"] = [];
        Data.data["ability-list"] = {};
        for (let i=0; i<Data.data["profession"].length; i++) {
          Data.data["profession-list"].push(Data.data["profession"][i].name);
          let abilities = Data.data["profession"][i].abilities.split(",");
          for(let j=0; j<abilities.length; j++) {
            if (abilities[j] === "") continue;
            let abilityName = abilities[j];
            if (typeof(Data.data["ability-list"][abilityName]) === "undefined") {
              Data.data["ability-list"][abilityName] = 0;
            }
          }
        }
        // 流派
        Data.loadBuildDataFromServer("style", () => {
          if ((typeof(Data.data["style"].length) === "undefined") || (Data.data["style"].length === 0)) { callback(false); return; }
          Data.data["style-list"] = [];
          for (let i=0; i<Data.data["style"].length; i++) {
            Data.data["style-list"].push(Data.data["style"][i].name);
          }
          // 装备
          Data.loadBuildDataFromServer("equip", () => {
            if ((typeof(Data.data["equip"].length) === "undefined") || (Data.data["equip"].length === 0)) { callback(false); return; }
            Data.data["equip-class-list"] = [];
            for (let i=0; i<Data.data["equip"].length; i++) {
              Data.data["equip-class-list"].push(Data.data["equip"][i].name);
            }
            // 道具
            Data.loadBuildDataFromServer("item", () => {
              if ((typeof(Data.data["item"].length) === "undefined") || (Data.data["item"].length === 0)) { callback(false); return; }
              Data.data["item-list"] = [];
              for (let i=0; i<Data.data["item"].length; i++) {
                Data.data["item-list"].push(Data.data["item"][i].name);
              }
              // 从服务器读取所有数据完毕，开始初始化
              _this.initBuild();
              callback(Data.data);
            });
          });
        });
      });
    });
  },

  initBuild() {
    if (Data.getItem("race-list-select") === '') Data.setItem("race-list-select", Data.data["race"][0].name);
    let raceSelect;
    for (raceSelect=0; raceSelect<Data.data["race"].length; raceSelect++) {
      if (Data.data["race"][raceSelect].name === Data.data["race-list-select"]) break;
    }
    Data.data["current-race"] = Data.data["race"][raceSelect];
    if (Data.getItem("params-xp") === '') Data.setItem("params-xp", 50);
    if (Data.getItem("params-radio") === '') Data.setItem("params-radio", "a");
    if (Data.getItem("params-int") === '') Data.setItem("params-int", Data.data["current-race"].minParams[0]);
    if (Data.getItem("params-str") === '') Data.setItem("params-str", Data.data["current-race"].minParams[1]);
    if (Data.getItem("params-agi") === '') Data.setItem("params-agi", Data.data["current-race"].minParams[2]);
    if (Data.getItem("params-vit") === '') Data.setItem("params-vit", Data.data["current-race"].minParams[3]);
    if (Data.getItem("params-crm") === '') Data.setItem("params-crm", Data.data["current-race"].minParams[4]);
    if (Data.getItem("params-cal") === '') Data.setItem("params-cal", Data.data["current-race"].minParams[5]);
    if (Data.getItem("params-pow") === '') Data.setItem("params-pow", Data.data["current-race"].minParams[6]);
    if (Data.getItem("params-dex") === '') Data.setItem("params-dex", Data.data["current-race"].minParams[7]);
    if (Data.getItem("params-for") === '') Data.setItem("params-for", Data.data["current-race"].minParams[8]);
    if (Data.getItem("params-con") === '') Data.setItem("params-con", Data.data["current-race"].minParams[9]);
  },

  changeRace(raceName) {
    let raceSelect;
    for (raceSelect=0; raceSelect<Data.data["race"].length; raceSelect++) {
      if (Data.data["race"][raceSelect].name === raceName) break;
    }
    Data.data["current-race"] = Data.data["race"][raceSelect];
    Data.setItem("params-int", Data.data["current-race"].minParams[0]);
    Data.setItem("params-str", Data.data["current-race"].minParams[1]);
    Data.setItem("params-agi", Data.data["current-race"].minParams[2]);
    Data.setItem("params-vit", Data.data["current-race"].minParams[3]);
    Data.setItem("params-crm", Data.data["current-race"].minParams[4]);
    Data.setItem("params-cal", Data.data["current-race"].minParams[5]);
    Data.setItem("params-pow", Data.data["current-race"].minParams[6]);
    Data.setItem("params-dex", Data.data["current-race"].minParams[7]);
    Data.setItem("params-for", Data.data["current-race"].minParams[8]);
    Data.setItem("params-con", Data.data["current-race"].minParams[9]);
  },

  // 计算能力点升级消耗
  getParamCost(cost) {
    if (cost <= 3) return cost;
    return ((cost - 3) * 2 + 3);
  },

  // 计算通过XP获取的属性点
  getXPParamPoints() {
    return Math.floor(Data.getNumberItem("params-xp") / 50);
  },

  // 计算所有属性点的消耗，type=true表属性点，type=false里属性点
  getParamsCost(type = true) {
    if (type) {
      return (
        this.getParamCost(parseInt(Data.getItem("params-int")) - Data.data["current-race"].minParams[0]) +
        this.getParamCost(parseInt(Data.getItem("params-str")) - Data.data["current-race"].minParams[1]) +
        this.getParamCost(parseInt(Data.getItem("params-agi")) - Data.data["current-race"].minParams[2]) +
        this.getParamCost(parseInt(Data.getItem("params-vit")) - Data.data["current-race"].minParams[3]) +
        this.getParamCost(parseInt(Data.getItem("params-crm")) - Data.data["current-race"].minParams[4])
      );
    }
    else {
      return (
        this.getParamCost(parseInt(Data.getItem("params-cal")) - Data.data["current-race"].minParams[5]) +
        this.getParamCost(parseInt(Data.getItem("params-pow")) - Data.data["current-race"].minParams[6]) +
        this.getParamCost(parseInt(Data.getItem("params-dex")) - Data.data["current-race"].minParams[7]) +
        this.getParamCost(parseInt(Data.getItem("params-for")) - Data.data["current-race"].minParams[8]) +
        this.getParamCost(parseInt(Data.getItem("params-con")) - Data.data["current-race"].minParams[9])
      );
    }
  },

  // 获取建卡提供的属性点，type=true表属性点，type=false里属性点
  getRemainParamPoints(type = true) {
    if (type) {
      let paramPoints = Data.data["current-race"].initialParamPoints[0];
      switch (Data.getItem("params-radio")) {
        case 'a': paramPoints+=2; break;
        case 'c': paramPoints+=1; break;
      }
      return (paramPoints - this.getParamsCost())
    }
    else {
      let paramPoints = Data.data["current-race"].initialParamPoints[1];
      switch (Data.getItem("params-radio")) {
        case 'b': paramPoints+=2; break;
        case 'c': paramPoints+=1; break;
      }
      return (paramPoints - this.getParamsCost(false))
    }
  },

  // 计算能力点
  getAbilityPoints() {
    let _int = (typeof(Data.getItem("params-int")) === "string") ? parseInt(Data.getItem("params-int")) : Data.getItem("params-int");
    let _totalAbilityPoints = Data.data["current-race"].initialAbilityPoints + _int;
    if (Data.getItem("params-radio") === 'd') _totalAbilityPoints += 6;
    return _totalAbilityPoints;
  },

  // 计算技能点
  getSkillPoints() {
    let _int = (typeof(Data.getItem("params-int")) === "string") ? parseInt(Data.getItem("params-int")) : Data.getItem("params-int");
    let _totalSkillPoints = Data.data["current-race"].initialSkillPoints + _int;
    return _totalSkillPoints;
  },

  // 用于推理详细加点过程
  getAbilityPointCostList(abilityLevel, customAbilityLevel, double = false) {
    let costPointList = [];
    let currentLevel = abilityLevel;
    for (let i=0; i<customAbilityLevel; i++) {
      if (currentLevel >= 3) costPointList.push(double?6:3);
      else costPointList.push(double?2:1);
      currentLevel++;
    }
    return costPointList;
  },

  // 计算单项能力上升的XP消耗，仅考虑必须要用XP来点的部分
  getAbilityXPCost(abilityLevel, customAbilityLevel) {
    if (abilityLevel + customAbilityLevel <= 4) return 0;
    return (abilityLevel + customAbilityLevel - 4) * 15;
  },

  // 获取消耗的能力点
  getSavedAbilityPointsCost() {
    if (Data.getItem("ability-cost") === "") return 0;
    return (typeof(Data.getItem("ability-cost")) === "string") ? parseInt(Data.getItem("ability-cost")) : Data.getItem("ability-cost");
  },

  // 获取通过点能力消耗的XP点
  getSavedAbilityXPCost() {
    if (Data.getItem("ability-xp-cost") === "") return 0;
    return (typeof(Data.getItem("ability-xp-cost")) === "string") ? parseInt(Data.getItem("ability-xp-cost")) : Data.getItem("ability-xp-cost");
  },

  // 获取消耗的技能点
  getSavedSkillPointsCost() {
    if (Data.getItem("skill-cost") === "") return 0;
    return (typeof(Data.getItem("skill-cost")) === "string") ? parseInt(Data.getItem("skill-cost")) : Data.getItem("skill-cost");
  },

  // 获取通过点技能消耗的XP点
  getSavedSkillXPCost() {
    if (Data.getItem("skill-xp-cost") === "") return 0;
    return (typeof(Data.getItem("skill-xp-cost")) === "string") ? parseInt(Data.getItem("skill-xp-cost")) : Data.getItem("skill-xp-cost");
  },

  // 输入选择职业的id，输出选完职业后的职业/能力列表
  getAbilityInfo(selectedKeys) {
    let selectedProfessions = [];
    let selectedAbilities = {};
    if (selectedKeys.length > 0) {
      for (let i = 0; i < selectedKeys.length; i++) {
        let _profession = Data.getItem('profession')[selectedKeys[i]];
        selectedProfessions.push(_profession.name);
        let _abilityList = _profession.abilities.split(",");
        for (let j = 0; j < _abilityList.length; j++) {
          if (typeof(selectedAbilities[_abilityList[j]]) === "undefined") {
            selectedAbilities[_abilityList[j]] = 1;
          }
          else {
            selectedAbilities[_abilityList[j]]++;
          }
          if (selectedAbilities[_abilityList[j]] > 3) selectedAbilities[_abilityList[j]] = 3;
        }
      }
    }
    return {
      professions: selectedProfessions,
      abilities: selectedAbilities
    }
  },

  // 获取能力级别
  getCustomAbilityLevel(abilityName) {
    let customAbilities = Data.getItem("custom-abilities").split(",");
    let customAbilityLevel = 0;
    for (let j=0; j<customAbilities.length; j++) {
      if (customAbilities[j] === "") continue;
      let _abilityInfo = customAbilities[j].split("|");
      if (_abilityInfo[0] === abilityName) {
        customAbilityLevel = parseInt(_abilityInfo[1]);
        break;
      }
    }
    return customAbilityLevel;
  },

  // 或取总能力级别
  setAbilityLevel(abilityName, value) {
    if (typeof(Data.data["final-ability-level"]) === "undefined") {
      Data.data["final-ability-level"] = {};
    }
    Data.data["final-ability-level"][abilityName] = value;
  },

  // 清理能力级别
  clearAbilityLevel() {
    Data.data["final-ability-level"] = {};
  },

  // 或取总能力级别
  getAbilityLevel(abilityName) {
    if (typeof(Data.data["final-ability-level"][abilityName]) === "undefined") {
      return 0;
    }
    return Data.data["final-ability-level"][abilityName];
  },

  // 设置能力加点
  setCustomAbility(abilityName, add = true) {
    let customAbilities = Data.getItem("custom-abilities").split(",");
    let customAbilitiesNew = [];
    let found = false;
    for (let j=0; j<customAbilities.length; j++) {
      if (customAbilities[j] === "") continue;
      let _abilityInfo = customAbilities[j].split("|");
      if (_abilityInfo[0] === abilityName) {
        found = true;
        let customAbilityLevel = parseInt(_abilityInfo[1]);
        let customAbilityLevelNew = add ? customAbilityLevel + 1 : customAbilityLevel - 1;
        if (customAbilityLevelNew > 0) {
          customAbilitiesNew.push(abilityName + "|" + customAbilityLevelNew);
        }
      }
      else {
        customAbilitiesNew.push(customAbilities[j]);
      }
    }
    if (!found) customAbilitiesNew.push(abilityName + "|1");
    Data.setItem("custom-abilities", customAbilitiesNew.join(","));
  },

  // 输入选择流派的id，输出选完职业后的流派/技能列表
  getSkillInfo(selectedKeys) {
    let selectedStyles = [];
    let selectedSkills = {};
    if (selectedKeys.length > 0) {
      for (let i = 0; i < selectedKeys.length; i++) {
        let _style = Data.getItem('style')[selectedKeys[i]];
        selectedStyles.push(_style.name);
        let _skillList = _style.list;
        for (let j = 0; j < _skillList.length; j++) {
          if (typeof(selectedSkills[_skillList[j].name]) === "undefined") {
            selectedSkills[_skillList[j].name] = _skillList[j];
          }
        }
      }
    }
    return {
      styles: selectedStyles,
      skills: selectedSkills
    }
  },

  // 或取技能需求描述
  getSkillRequirementDescription(requirementStr) {
    let _requirements = requirementStr.split(",");
    let _descr = "";
    let _added = false;
    let _isValid = true;
    for (let i=0; i<_requirements.length; i++) {
      if (_requirements[i] === "") continue;
      let _re = _requirements[i].split("|");
      if (_added) _descr += " 及 ";
      switch (_re[0]) {
        case 'P':
          _descr += "属性-";
          break;
        case 'A':
          _descr += "能力-";
          break;
        case 'S':
          _descr += "技能-";
          break;
      }
      _descr += _re[1] + ":" + _re[2];
      _added = true;
      if (!this.checkSkillRequirement(_re[0], _re[1], parseInt(_re[2]))) _isValid = false;
    }
    return {
      valid: _isValid,
      description: _descr
    };
  },

  // 检查是否满足技能需求
  checkSkillRequirement(type, name, value) {
    switch (type) {
      case 'P':
        switch (name) {
          case '智力': if (Data.getItem("params-int") >= value) return true; break;
          case '力量': if (Data.getItem("params-str") >= value) return true; break;
          case '灵巧': if (Data.getItem("params-agi") >= value) return true; break;
          case '体魄': if (Data.getItem("params-vit") >= value) return true; break;
          case '仪态': if (Data.getItem("params-crm") >= value) return true; break;
          case '沉着': if (Data.getItem("params-cal") >= value) return true; break;
          case '气势': if (Data.getItem("params-pow") >= value) return true; break;
          case '敏锐': if (Data.getItem("params-dex") >= value) return true; break;
          case '坚毅': if (Data.getItem("params-for") >= value) return true; break;
          case '操控': if (Data.getItem("params-con") >= value) return true; break;
        }
        break;
      case 'A':
        if (this.getAbilityLevel(name) >= value) return true;
        break;
      case 'S':
        if (this.getSkillLevel(name) >= value) return true;
        break;
    }
    return false;
  },

  // 获取技能级别
  getSkillLevel(skillName) {
    let customSkills = Data.getItem("custom-skills").split(",");
    let customSkillLevel = 0;
    for (let j=0; j<customSkills.length; j++) {
      if (customSkills[j] === "") continue;
      let _skillInfo = customSkills[j].split("|");
      if (_skillInfo[0] === skillName) {
        customSkillLevel = parseInt(_skillInfo[1]);
        break;
      }
    }
    return customSkillLevel;
  },

  // 设置技能加点
  setSkillLevel(skillName, add = true) {
    let customSkills = Data.getItem("custom-skills").split(",");
    let customSkillsNew = [];
    let found = false;
    for (let j=0; j<customSkills.length; j++) {
      if (customSkills[j] === "") continue;
      let _skillInfo = customSkills[j].split("|");
      if (_skillInfo[0] === skillName) {
        found = true;
        let customSkillLevel = parseInt(_skillInfo[1]);
        let customSkillLevelNew = add ? customSkillLevel + 1 : customSkillLevel - 1;
        if (customSkillLevelNew > 0) {
          customSkillsNew.push(skillName + "|" + customSkillLevelNew);
        }
      }
      else {
        customSkillsNew.push(customSkills[j]);
      }
    }
    if (!found) customSkillsNew.push(skillName + "|1");
    Data.setItem("custom-skills", customSkillsNew.join(","));
  },

  // 输入选择道具类型的id，输出选完后的道具列表
  getEquipInfo(selectedKeys) {
    let selectedEquipClasses = [];
    let selectedEquips = {};
    if (selectedKeys.length > 0) {
      for (let i = 0; i < selectedKeys.length; i++) {
        let _equipClass = Data.getItem('equip')[selectedKeys[i]];
        selectedEquipClasses.push(_equipClass.name);
        let _equipList = _equipClass.list;
        for (let j = 0; j < _equipList.length; j++) {
          if (typeof(selectedEquips[_equipList[j].name]) === "undefined") {
            selectedEquips[_equipList[j].name] = {
              name: _equipList[j].name,
              classid: selectedKeys[i],
              equipid: j
            };
          }
        }
      }
    }
    let selectedEquipList = [];
    for (let equipName in selectedEquips) {
      selectedEquipList.push({
        "name": selectedEquips[equipName].name,
        "classid": selectedEquips[equipName].classid,
        "equipid": selectedEquips[equipName].equipid
      });
    }
    return {
      equipClasses: selectedEquipClasses,
      equips: selectedEquipList
    }
  },

  // 或取Equip的名字
  getEquipName(classId, equipId) {
    if (typeof(Data.getItem("equip")[classId].list[equipId]) === "undefined") return "";
    return Data.getItem("equip")[classId].list[equipId].name;
  },

  // 或取Equip的效果描述
  getEquipDescription(classId, equipId) {
    if (typeof(Data.getItem("equip")[classId].list[equipId]) === "undefined") return "";
    return Data.getItem("equip")[classId].list[equipId].description;
  },

  // 或取Equip的价格描述
  getEquipPrice(classId, equipId) {
    if (typeof(Data.getItem("equip")[classId].list[equipId]) === "undefined") return "";
    return "价格：" + this.getPriceDescription(Data.getItem("equip")[classId].list[equipId].price);
  },

  // 或取Equip的价格
  getEquipPriceNumber(classId, equipId) {
    if (typeof(Data.getItem("equip")[classId].list[equipId]) === "undefined") return 0;
    return Data.getItem("equip")[classId].list[equipId].price;
  },

  // 或取Equip的重量描述
  getEquipWeight(classId, equipId) {
    if (typeof(Data.getItem("equip")[classId].list[equipId]) === "undefined") return "";
    return "重量：" + Data.getItem("equip")[classId].list[equipId].weight + "KG";
  },

  // 或取Equip的重量描述
  getEquipWeightNumber(classId, equipId) {
    if (typeof(Data.getItem("equip")[classId].list[equipId]) === "undefined") return 0;
    return Data.getItem("equip")[classId].list[equipId].weight;
  },

  // 或取Item的名字
  getItemName(itemId) {
    if (typeof(Data.getItem('item')[itemId]) === "undefined") return "";
    return Data.getItem('item')[itemId].name;
  },

  // 或取Item的价格描述
  getItemPrice(itemId) {
    if (typeof(Data.getItem('item')[itemId]) === "undefined") return "";
    return "价格：" + this.getPriceDescription(Data.getItem('item')[itemId].price);
  },

  // 或取Item的价格
  getItemPriceNumber(itemId) {
    if (typeof(Data.getItem('item')[itemId]) === "undefined") return 0;
    return Data.getItem('item')[itemId].price;
  },

  // 或取Item的重量描述
  getItemWeight(itemId) {
    if (typeof(Data.getItem('item')[itemId]) === "undefined") return "";
    return "重量：" + Data.getItem("item")[itemId].weight + "KG";
  },

  // 或取Item的重量
  getItemWeightNumber(itemId) {
    if (typeof(Data.getItem('item')[itemId]) === "undefined") return 0;
    return Data.getItem("item")[itemId].weight;
  },

  // 获取自定义物品的描述和重量
  parseOriginalObj(originalObjStr) {
    let originalObj = originalObjStr.split('|');
    if (originalObj.length === 4) {
      return {
        name: originalObj[0],
        weight: parseFloat(originalObj[1]),
        price: parseInt(originalObj[2]),
        displayPrice: originalObj[3]
      }
    } else {
      return {
        name: 'Undefined',
        weight: 0.0,
        price: 0,
        displayPrice: this.getPriceDescription(0)
      }
    }
  },

  // 添加自定义物品
  addOriginalObj(name, weight, price) {
    let itemStr = (name + "|" + weight + "|" + price + "|" + this.getPriceDescription(price)).trim();
    if (Data.getItem("original-objs").trim() === "") {
      Data.setItem("original-objs", itemStr);
    } else {
      let originalObjs = Data.getItem("original-objs").split(',');
      originalObjs.push(itemStr);
      Data.setItem("original-objs", originalObjs.join(","));
    }
  },

  // 编辑自定义物品
  editOriginalObj(index, name, weight, price) {
    let originalObjs = Data.getItem("original-objs").split(',');
    let newList = [];
    for (let i=0; i<originalObjs.length; i++) {
      if (i === index) {
        newList.push(name + "|" + weight + "|" + price + "|" + this.getPriceDescription(price));
      } else {
        newList.push(originalObjs[i]);
      }
    }
    Data.setItem("original-objs", newList.join(","));
  },

  // 删除自定义物品
  deleteOriginalObj(index) {
    let originalObjs = Data.getItem("original-objs").split(',');
    let newList = [];
    for (let i=0; i<originalObjs.length; i++) {
      if (i !== index) {
        newList.push(originalObjs[i]);
      }
    }
    Data.setItem("original-objs", newList.join(","));
  },

  // 增加商品数量
  getExtraEquipAmount(classId, equipId) {
    let extraEquips = Data.getItem("extra-equips").split(",");
    let extraEquipsAmount = 0;
    for (let j=0; j<extraEquips.length; j++) {
      if (extraEquips[j] === "") continue;
      let _equipInfo = extraEquips[j].split("|");
      if ((parseInt(_equipInfo[0]) === classId) && (parseInt(_equipInfo[1]) === equipId)) {
        extraEquipsAmount = parseInt(_equipInfo[2]);
        break;
      }
    }
    return extraEquipsAmount;
  },

  // 增加或减少商品数量
  setExtraEquipAmount(classId, equipId, add = true) {
    let extraEquips = Data.getItem("extra-equips").split(",");
    let extraEquipsNew = [];
    let found = false;
    for (let j=0; j<extraEquips.length; j++) {
      if (extraEquips[j] === "") continue;
      let _equipInfo = extraEquips[j].split("|");
      if ((parseInt(_equipInfo[0]) === classId) && (parseInt(_equipInfo[1]) === equipId)) {
        found = true;
        let extraEquipAmount = parseInt(_equipInfo[2]);
        let extraEquipAmountNew = add ? extraEquipAmount + 1 : extraEquipAmount - 1;
        if (extraEquipAmountNew > 0) {
          extraEquipsNew.push("" + classId + "|" + equipId + "|" + extraEquipAmountNew);
        }
      }
      else {
        extraEquipsNew.push(extraEquips[j]);
      }
    }
    if (!found) extraEquipsNew.push("" + classId + "|" + equipId + "|1");
    Data.setItem("extra-equips", extraEquipsNew.join(","));
  },

  // 计算价格
  getPriceDescription(price) {
    let _price = price;
    let _money7 = Math.floor(_price / 10000);
    _price %= 10000;
    let _money6 = Math.floor(_price / 5000);
    _price %= 5000;
    let _money5 = Math.floor(_price / 1000);
    _price %= 1000;
    let _money4 = Math.floor(_price / 100);
    _price %= 100;
    let _money3 = Math.floor(_price / 50);
    _price %= 50;
    let _money2 = Math.floor(_price / 10);
    _price %= 10;
    let _money1 = _price;
    let _descr = "";
    if (_money7 > 0) _descr += _money7 + "大金币 ";
    if (_money6 > 0) _descr += _money6 + "中金币 ";
    if (_money5 > 0) _descr += _money5 + "小金币 ";
    if (_money4 > 0) _descr += _money4 + "大银币 ";
    if (_money3 > 0) _descr += _money3 + "中银币 ";
    if (_money2 > 0) _descr += _money2 + "小银币 ";
    if (_money1 > 0) _descr += _money1 + "铜币";
    if (_descr === "") _descr = "免费";
    return _descr;
  },

  // 检查每一页是否OK
  checkStep(step) {
    let _status = true;
    let _msg = "SUCCEED";
    let xp, abilityPoints, abilityCost, abilityXPCost, skillPoints, skillCost, skillXPCost;
    switch (step) {
      case 0:
        if (Data.getItem("name") === "") {
          _status = false;
          _msg = "请输入姓名";
          break;
        }
        if (Data.getItem("introduction") === "") {
          _status = false;
          _msg = "请输入简介";
          break;
        }
        break;
      case 1:
        let paramPoints1 = this.getRemainParamPoints();
        let paramPoints2 = this.getRemainParamPoints(false);
        let paramPoints3 = this.getXPParamPoints();
        if (paramPoints1 < 0) paramPoints3 += paramPoints1;
        if (paramPoints2 < 0) paramPoints3 += paramPoints2;
        if (paramPoints3 < 0) {
          _status = false;
          _msg = "属性点超支";
          break;
        }
        break;
      case 2:
        abilityPoints = this.getAbilityPoints();
        abilityCost = this.getSavedAbilityPointsCost();
        xp = Data.getNumberItem("params-xp");
        abilityXPCost = this.getSavedAbilityXPCost();
        if (abilityCost > abilityPoints) {
          _status = false;
          _msg = "能力点超支";
          break;
        }
        if (abilityXPCost > xp) {
          _status = false;
          _msg = "XP超支";
          break;
        }
        break;
      case 3:
        skillPoints = this.getSkillPoints();
        skillCost = this.getSavedSkillPointsCost();
        xp = Data.getNumberItem("params-xp");
        abilityXPCost = this.getSavedAbilityXPCost();
        skillXPCost = this.getSavedSkillXPCost();
        if (skillCost > skillPoints) {
          _status = false;
          _msg = "技能点超支";
          break;
        }
        if (abilityXPCost + skillXPCost > xp) {
          _status = false;
          _msg = "XP超支";
          break;
        }
        break;
      case 4:
        break;
      default:
        _status = false;
        _msg = "INVALID STEP";
    }
    return {
      status: _status,
      msg: _msg
    }
  },

  toJsonObj() {
    let name         = Data.getItem("name");
    let introduction = Data.getItem("introduction");
    let gender       = Data.getItem("gender");
    let age          = Data.getItem("age");
    let height       = Data.getItem("height");
    let weight       = Data.getItem("weight");
    let skin         = Data.getItem("skin");
    let hair         = Data.getItem("hair");
    let eye          = Data.getItem("eye");
    let hand         = Data.getItem("hand");
    let appear       = Data.getItem("appear");
    let story        = Data.getItem("story");
    let addition     = Data.getItem("addition");
    let race         = Data.getItem("race-list-select");
    let xp           = Data.getItem("params-xp");
    let xpCost       = Data.getItem("final-xp-cost");
    let radio        = Data.getItem("params-radio");
    let pint         = Data.getItem("params-int");
    let pstr         = Data.getItem("params-str");
    let pagi         = Data.getItem("params-agi");
    let pvit         = Data.getItem("params-vit");
    let pcrm         = Data.getItem("params-crm");
    let pcal         = Data.getItem("params-cal");
    let ppow         = Data.getItem("params-pow");
    let pdex         = Data.getItem("params-dex");
    let pfor         = Data.getItem("params-for");
    let pcon         = Data.getItem("params-con");
    let professions  = Data.getItem("final-professions");
    let abilities    = Data.getItem("final-abilities");
    let skills       = Data.getItem("final-skills");
    let equips       = Data.getItem("final-equips");
    let items        = Data.getItem("final-items");
    let originalObjs = Data.getItem("original-objs");
    let priceSum     = Data.getItem("price-sum");
    let weightSum    = Data.getItem("weight-sum");
    // 以上内容构成了卡片的完整信息，以下则是一些中间状态，用于Edit的补充数据
    let edit = {
      professionTargetKeys: Data.getItem("profession-target-keys"),
      customProfessions: Data.getItem("custom-professions"),
      customAbilities: Data.getItem("custom-abilities"),
      extraAbilities: Data.getItem("extra-abilities"),
      styleTargetKeys: Data.getItem("style-target-keys"),
      customSkills: Data.getItem("custom-skills"),
      skillXPCost: Data.getItem("skill-xp-cost"),
      equipClassTargetKeys: Data.getItem("equip-class-target-keys"),
      customEquips: Data.getItem("custom-equips"),
      customItems: Data.getItem("custom-items"),
      extraEquips: Data.getItem("extra-equips")
    };
    return {
      name: encodeURIComponent(name),
      introduction: encodeURIComponent(introduction),
      gender: encodeURIComponent(gender),
      age: encodeURIComponent(age),
      height: encodeURIComponent(height),
      weight: encodeURIComponent(weight),
      skin: encodeURIComponent(skin),
      hair: encodeURIComponent(hair),
      eye: encodeURIComponent(eye),
      hand: encodeURIComponent(hand),
      appear: encodeURIComponent(appear),
      story: encodeURIComponent(story),
      addition: encodeURIComponent(addition),
      race: encodeURIComponent(race),
      xp: xp,
      xpCost: xpCost,
      radio: radio,
      pint: pint,
      pstr: pstr,
      pagi: pagi,
      pvit: pvit,
      pcrm: pcrm,
      pcal: pcal,
      ppow: ppow,
      pdex: pdex,
      pfor: pfor,
      pcon: pcon,
      professions: encodeURIComponent(professions),
      abilities: encodeURIComponent(abilities),
      skills: encodeURIComponent(skills),
      equips: encodeURIComponent(equips),
      items: encodeURIComponent(items),
      originalObjs: encodeURIComponent(originalObjs),
      priceSum: priceSum,
      weightSum: weightSum,
      edit: edit
    }
  }

};

export default Build;
