#!name = NodeList自动化处理
#!desc = 自动化处理分类NodeList


// 获取所有引入的代理
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
  "稀有地区": []  // 稀有地区组，用于存储节点数量少于3个的国家
};

// 遍历所有代理并按国家进行分类
allProxies.forEach(proxy => {
  if (proxy.includes("Hong Kong")) {
    categorizedNodes["🇭🇰 Hong Kong"].push(proxy);
  } else if (proxy.includes("USA")) {
    categorizedNodes["🇺🇸 USA"].push(proxy);
  } else if (proxy.includes("Japan")) {
    categorizedNodes["🇯🇵 Japan"].push(proxy);
  } else if (proxy.includes("Netherlands")) {
    categorizedNodes["🇳🇱 Netherlands"].push(proxy);
  } else if (proxy.includes("Russia")) {
    categorizedNodes["🇷🇺 Russia"].push(proxy);
  } else if (proxy.includes("Germany")) {
    categorizedNodes["🇩🇪 Germany"].push(proxy);
  } else if (proxy.includes("France")) {
    categorizedNodes["🇫🇷 France"].push(proxy);
  } else if (proxy.includes("Switzerland")) {
    categorizedNodes["🇨🇭 Switzerland"].push(proxy);
  } else if (proxy.includes("UK") || proxy.includes("London") || proxy.includes("Coventry")) {
    categorizedNodes["🇬🇧 UK"].push(proxy);
  } else if (proxy.includes("Sweden")) {
    categorizedNodes["🇸🇪 Sweden"].push(proxy);
  } else if (proxy.includes("Bulgaria")) {
    categorizedNodes["🇧🇬 Bulgaria"].push(proxy);
  } else if (proxy.includes("Austria")) {
    categorizedNodes["🇦🇹 Austria"].push(proxy);
  } else if (proxy.includes("Ireland")) {
    categorizedNodes["🇮🇪 Ireland"].push(proxy);
  } else if (proxy.includes("Turkey")) {
    categorizedNodes["🇹🇷 Turkey"].push(proxy);
  } else if (proxy.includes("Hungary")) {
    categorizedNodes["🇭🇺 Hungary"].push(proxy);
  } else if (proxy.includes("Korea")) {
    categorizedNodes["🇰🇷 Korea"].push(proxy);
  } else if (proxy.includes("Taiwan")) {
    categorizedNodes["🇨🇳 Taiwan"].push(proxy);
  } else if (proxy.includes("Canada")) {
    categorizedNodes["🇨🇦 Canada"].push(proxy);
  } else if (proxy.includes("Australia")) {
    categorizedNodes["🇦🇺 Australia"].push(proxy);
  } else if (proxy.includes("United Arab Emirates")) {
    categorizedNodes["🇦🇪 United Arab Emirates"].push(proxy);
  } else if (proxy.includes("India")) {
    categorizedNodes["🇮🇳 India"].push(proxy);
  } else if (proxy.includes("Indonesia")) {
    categorizedNodes["🇮🇩 Indonesia"].push(proxy);
  } else if (proxy.includes("Brazil")) {
    categorizedNodes["🇧🇷 Brazil"].push(proxy);
  } else if (proxy.includes("Argentina")) {
    categorizedNodes["🇦🇷 Argentina"].push(proxy);
  } else if (proxy.includes("Chile")) {
    categorizedNodes["🇨🇱 Chile"].push(proxy);
  } else if (proxy.includes("Singapore")) {
    categorizedNodes["🇸🇬 Singapore"].push(proxy);
  } else {
    // 未知或不在列表中的节点
    categorizedNodes["稀有地区"].push(proxy);
  }
});

// 将节点数量少于3个的国家归类为"稀有地区"
for (let country in categorizedNodes) {
  if (categorizedNodes[country].length < 3 && country !== "稀有地区") {
    categorizedNodes["稀有地区"] = categorizedNodes["稀有地区"].concat(categorizedNodes[country]);
    delete categorizedNodes[country]; // 删除这个国家组
  }
}

// 插入新代理组，而不影响现有的组
for (let country in categorizedNodes) {
  if (categorizedNodes[country].length > 0) {
    if (!$surge.policyExists(country)) {
      // 如果该代理组不存在，则创建并插入
      $surge.setPolicyProxies(country, categorizedNodes[country]);
    }
  }
}
