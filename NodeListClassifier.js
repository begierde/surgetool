#!name=Node List Classifier
#!desc=Classifies nodes from a NodeList into different groups based on their names, including a "Premium Nodes" group and a "Rare Regions" group for nodes with less than 3 nodes.

/*
 * Module Name: Node List Classifier
 * Description: This script classifies nodes from a NodeList into different groups based on their names. 
 *              It creates or updates proxy groups in Surge configuration, ensuring no duplicate nodes 
 *              are inserted into existing groups. It also handles "Premium" nodes and groups with 
 *              less than 3 nodes into a "Rare Regions" group.
 * Author: begierde
 * Version: 1.0
 * License: GPL 
 */


  
// 获取所有引入的代理，改为使用 NodeList
let allProxies = $surge.getPolicyProxies("NodeList");

// 创建对象存储按国家分类的节点
let categorizedNodes = {
  "🇭🇰 Hong Kong": [],
  "🇺🇸 USA": [],
  "🇯🇵 Japan": [],
  "🇳🇱 Netherlands": [],
  "🇷🇺 Russia": [],
  "🇩🇪 Germany": [],
  "🇫🇷 France": [],
  "🇨🇭 Switzerland": [],
  "🇬🇧 UK": [],
  "🇸🇪 Sweden": [],
  "🇧🇬 Bulgaria": [],
  "🇦🇹 Austria": [],
  "🇮🇪 Ireland": [],
  "🇹🇷 Turkey": [],
  "🇭🇺 Hungary": [],
  "🇰🇷 Korea": [],
  "🇨🇳 Taiwan": [],
  "🇨🇦 Canada": [],
  "🇦🇺 Australia": [],
  "🇦🇪 United Arab Emirates": [],
  "🇮🇳 India": [],
  "🇮🇩 Indonesia": [],
  "🇧🇷 Brazil": [],
  "🇦🇷 Argentina": [],
  "🇨🇱 Chile": [],
  "🇸🇬 Singapore": [],
  "稀有地区": [],  // 稀有地区组，用于存储节点数量少于3个的国家
  "Premium Nodes": []  // 新增的组，用于存储包含 "Premium" 的节点
};

// 匹配规则，键为组名，值为匹配该组的关键词
let matchRules = {
  "🇭🇰 Hong Kong": /Hong Kong/i,
  "🇺🇸 USA": /USA|Los Angeles|San Jose|Seattle/i,
  "🇯🇵 Japan": /Japan/i,
  "🇳🇱 Netherlands": /Netherlands/i,
  "🇷🇺 Russia": /Russia|Moscow|St\. Petersburg/i,
  "🇩🇪 Germany": /Germany/i,
  "🇫🇷 France": /France/i,
  "🇨🇭 Switzerland": /Switzerland/i,
  "🇬🇧 UK": /UK|London|Coventry/i,
  "🇸🇪 Sweden": /Sweden/i,
  "🇧🇬 Bulgaria": /Bulgaria/i,
  "🇦🇹 Austria": /Austria/i,
  "🇮🇪 Ireland": /Ireland/i,
  "🇹🇷 Turkey": /Turkey/i,
  "🇭🇺 Hungary": /Hungary/i,
  "🇰🇷 Korea": /Korea/i,
  "🇨🇳 Taiwan": /Taiwan/i,
  "🇨🇦 Canada": /Canada/i,
  "🇦🇺 Australia": /Australia|Sydney/i,
  "🇦🇪 United Arab Emirates": /United Arab Emirates/i,
  "🇮🇳 India": /India/i,
  "🇮🇩 Indonesia": /Indonesia/i,
  "🇧🇷 Brazil": /Brazil/i,
  "🇦🇷 Argentina": /Argentina/i,
  "🇨🇱 Chile": /Chile/i,
  "🇸🇬 Singapore": /Singapore/i
};

// 遍历所有代理并按国家和 "Premium" 进行分类
allProxies.forEach(proxy => {
  if (proxy.includes("Premium")) {
    // 将包含 "Premium" 的节点添加到 "Premium Nodes" 组中
    categorizedNodes["Premium Nodes"].push(proxy);
  } else {
    // 使用匹配规则分类
    let matched = false;
    for (let country in matchRules) {
      if (matchRules[country].test(proxy)) {
        categorizedNodes[country].push(proxy);
        matched = true;
        break;
      }
    }
    if (!matched) {
      // 未匹配到的节点归类到 "稀有地区"
      categorizedNodes["稀有地区"].push(proxy);
    }
  }
});

// 将节点数量少于3个的国家归类为"稀有地区"
for (let country in categorizedNodes) {
  if (categorizedNodes[country].length < 3 && country !== "稀有地区" && country !== "Premium Nodes") {
    categorizedNodes["稀有地区"] = categorizedNodes["稀有地区"].concat(categorizedNodes[country]);
    delete categorizedNodes[country]; // 删除这个国家组
  }
}

// 插入新代理组或更新已有组
for (let country in categorizedNodes) {
  if (categorizedNodes[country].length > 0) {
    if ($surge.policyExists(country)) {
      // 如果代理组已存在，获取现有组的节点
      let existingProxies = $surge.getPolicyProxies(country);
      // 创建一个 Set 来存储现有的节点名称，用于去重
      let existingProxiesSet = new Set(existingProxies);

      // 将新节点插入现有组，确保不重复
      categorizedNodes[country].forEach(proxy => {
        if (!existingProxiesSet.has(proxy)) {
          existingProxies.push(proxy);
        }
      });

      // 更新代理组
      $surge.setPolicyProxies(country, existingProxies);
    } else {
      // 如果代理组不存在，则创建并插入
      $surge.setPolicyProxies(country, categorizedNodes[country]);
    }
  }
}
