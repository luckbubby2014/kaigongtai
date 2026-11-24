/**
 * 食材词典 + 保质期规则库
 * days: [最短天数, 最长天数]；null 表示「不建议此存放方式」
 * 规则为通用家庭储存经验的保守估算，参考 USDA FoodKeeper 与国内食品安全科普，仅供参考。
 */

export type Category =
  | 'veg' | 'fruit' | 'meat' | 'seafood' | 'egg' | 'dairy'
  | 'tofu' | 'staple' | 'leftover' | 'cond' | 'drink' | 'other';

export type Location = 'fridge' | 'freezer' | 'pantry';
export type Range = [number, number] | null;

export interface IngredientDef {
  key: string;
  name: string;
  aliases: string[];
  emoji: string;
  cat: Category;
  unit: string;
  /** 单位重量（克） */
  g: number;
  /** 单位均价（元），用于未填价格时估算 */
  price: number;
  /** 碳排因子 kg CO₂e / kg */
  co2: number;
  loc: Location;
  days: { fridge: Range; freezer: Range; pantry: Range };
  /** 开封后（冷藏）天数 */
  opened?: Range;
  /** 高风险食物 */
  risky?: boolean;
  tip?: string;
}

export const CATEGORIES: Record<Category, { name: string; emoji: string }> = {
  veg: { name: '蔬菜', emoji: '🥬' },
  fruit: { name: '水果', emoji: '🍎' },
  meat: { name: '肉类', emoji: '🥩' },
  seafood: { name: '水产', emoji: '🐟' },
  egg: { name: '蛋类', emoji: '🥚' },
  dairy: { name: '乳品', emoji: '🥛' },
  tofu: { name: '豆制品', emoji: '🧈' },
  staple: { name: '主食', emoji: '🍚' },
  leftover: { name: '剩菜', emoji: '🍱' },
  cond: { name: '调料酱料', emoji: '🧂' },
  drink: { name: '饮品', emoji: '🧃' },
  other: { name: '其他', emoji: '📦' },
};

export const LOCATIONS: Record<Location, { name: string; emoji: string }> = {
  fridge: { name: '冷藏', emoji: '❄️' },
  freezer: { name: '冷冻', emoji: '🧊' },
  pantry: { name: '常温', emoji: '🗄️' },
};

type Extra = Partial<Pick<IngredientDef, 'opened' | 'risky' | 'tip' | 'loc'>>;

function d(
  key: string,
  names: string,
  emoji: string,
  cat: Category,
  unit: string,
  g: number,
  price: number,
  co2: number,
  fridge: Range,
  freezer: Range,
  pantry: Range,
  extra: Extra = {},
): IngredientDef {
  const [name, ...aliases] = names.split('|');
  const loc: Location = extra.loc ?? (fridge ? 'fridge' : pantry ? 'pantry' : 'freezer');
  return { key, name, aliases, emoji, cat, unit, g, price, co2, loc, days: { fridge, freezer, pantry }, ...extra };
}

const LEAFY = '叶菜不耐放，用厨房纸包好装袋冷藏，发黄、发黏就别吃了。';
const RAW_MEAT = '生肉冷藏只能放 1–2 天；吃不完请尽快分装冷冻，解冻后不要反复冻融。';

export const INGREDIENTS: IngredientDef[] = [
  // —— 蔬菜 ——
  d('spinach', '菠菜', '🥬', 'veg', '把', 300, 4, 0.9, [3, 5], null, [1, 1], { tip: LEAFY }),
  d('bokchoy', '小青菜|青菜|上海青|油菜|小白菜', '🥬', 'veg', '把', 300, 3, 0.9, [3, 5], null, [1, 1], { tip: LEAFY }),
  d('lettuce', '生菜|油麦菜|莴苣叶', '🥬', 'veg', '颗', 300, 4, 0.9, [3, 5], null, [1, 1], { tip: LEAFY }),
  d('napa', '大白菜|白菜|娃娃菜', '🥬', 'veg', '颗', 1000, 5, 0.6, [7, 14], null, [5, 7]),
  d('cabbage', '包菜|卷心菜|圆白菜|洋白菜|甘蓝', '🥬', 'veg', '颗', 1000, 4, 0.6, [10, 14], null, [5, 7]),
  d('broccoli', '西兰花|西蓝花|绿花菜', '🥦', 'veg', '颗', 400, 6, 1.0, [3, 5], [300, 360], [1, 1]),
  d('cauliflower', '花菜|菜花|花椰菜', '🥦', 'veg', '颗', 600, 6, 1.0, [5, 7], [300, 360], [1, 2]),
  d('celery', '芹菜|西芹', '🥬', 'veg', '把', 400, 4, 0.6, [7, 14], null, [1, 2]),
  d('leek', '韭菜', '🌱', 'veg', '把', 250, 4, 0.9, [2, 3], null, [1, 1], { tip: LEAFY }),
  d('scallion', '小葱|葱|香葱|葱花', '🌱', 'veg', '把', 100, 2, 0.9, [5, 7], [60, 90], [1, 2]),
  d('leekgreen', '大葱', '🧅', 'veg', '根', 300, 3, 0.7, [10, 14], null, [7, 10]),
  d('cilantro', '香菜|芫荽', '🌿', 'veg', '把', 80, 2, 0.9, [3, 5], null, [1, 1]),
  d('tomato', '番茄|西红柿|小番茄|圣女果', '🍅', 'veg', '个', 180, 1.5, 1.4, [5, 7], null, [3, 5]),
  d('cucumber', '黄瓜|青瓜', '🥒', 'veg', '根', 250, 2, 0.6, [5, 7], null, [2, 3]),
  d('eggplant', '茄子', '🍆', 'veg', '个', 300, 3, 1.0, [5, 7], null, [2, 3]),
  d('pepper', '青椒|彩椒|甜椒|灯笼椒|尖椒|辣椒', '🫑', 'veg', '个', 120, 1.5, 1.0, [5, 7], [180, 240], [2, 3]),
  d('carrot', '胡萝卜|红萝卜', '🥕', 'veg', '根', 150, 1, 0.4, [14, 21], [300, 360], [5, 7]),
  d('radish', '白萝卜|萝卜|青萝卜', '🥕', 'veg', '根', 800, 3, 0.4, [10, 14], null, [5, 7]),
  d('potato', '土豆|马铃薯|洋芋', '🥔', 'veg', '个', 200, 1, 0.5, [14, 21], null, [14, 30], { loc: 'pantry', risky: true, tip: '发芽或表皮发青的土豆含龙葵素，请整颗丢弃，不要只挖掉芽眼。' }),
  d('sweetpotato', '红薯|地瓜|番薯', '🍠', 'veg', '个', 300, 2, 0.5, null, null, [14, 21]),
  d('onion', '洋葱', '🧅', 'veg', '个', 200, 1.5, 0.5, [14, 30], null, [14, 30], { loc: 'pantry' }),
  d('garlic', '大蒜|蒜|蒜头|蒜瓣', '🧄', 'veg', '头', 50, 1, 0.8, [30, 60], null, [30, 90], { loc: 'pantry' }),
  d('ginger', '姜|生姜|老姜', '🫚', 'veg', '块', 50, 1, 0.8, [14, 21], [90, 180], [7, 14]),
  d('mushroom', '蘑菇|香菇|口蘑|平菇|鲜菇|杏鲍菇|金针菇', '🍄', 'veg', '盒', 250, 6, 1.0, [3, 5], null, [1, 1]),
  d('beansprout', '豆芽|绿豆芽|黄豆芽', '🌱', 'veg', '袋', 300, 2, 0.6, [1, 2], null, [1, 1], { tip: '豆芽极易变质，买回当天或次日吃完。' }),
  d('greenbean', '豆角|四季豆|扁豆|长豆角', '🫛', 'veg', '把', 300, 4, 1.0, [3, 5], [240, 300], [1, 2], { tip: '四季豆等豆角必须彻底炒熟，否则可能中毒。' }),
  d('pea', '豌豆|荷兰豆|甜豆', '🫛', 'veg', '盒', 200, 5, 1.0, [3, 5], [240, 300], [1, 2]),
  d('corn', '玉米|甜玉米', '🌽', 'veg', '根', 300, 3, 1.0, [2, 3], [240, 300], [1, 2]),
  d('pumpkin', '南瓜|贝贝南瓜', '🎃', 'veg', '个', 1000, 6, 0.6, [5, 7], [240, 300], [30, 60], { loc: 'pantry' }),
  d('zucchini', '西葫芦|丝瓜|冬瓜', '🥒', 'veg', '个', 400, 3, 0.6, [5, 7], null, [3, 5]),
  d('bittermelon', '苦瓜', '🥒', 'veg', '根', 300, 3, 0.6, [4, 5], null, [2, 3]),
  d('lotus', '莲藕|藕', '🪷', 'veg', '节', 300, 4, 0.8, [5, 7], null, [2, 3]),
  d('yam', '山药|铁棍山药', '🥖', 'veg', '根', 400, 6, 0.8, [7, 10], [90, 180], [7, 14]),
  d('taro', '芋头|芋艿', '🥔', 'veg', '个', 200, 3, 0.8, null, null, [7, 14]),
  d('okra', '秋葵', '🫑', 'veg', '盒', 200, 5, 1.0, [2, 3], null, [1, 1]),
  d('asparagus', '芦笋', '🌱', 'veg', '把', 250, 10, 1.5, [3, 5], null, [1, 1]),

  // —— 水果 ——
  d('apple', '苹果', '🍎', 'fruit', '个', 200, 2.5, 0.4, [21, 30], null, [7, 10]),
  d('banana', '香蕉', '🍌', 'fruit', '根', 120, 1, 0.9, null, [60, 90], [3, 5], { loc: 'pantry' }),
  d('orange', '橙子|橘子|桔子|柑橘|砂糖橘', '🍊', 'fruit', '个', 200, 2, 0.4, [14, 21], null, [7, 10]),
  d('lemon', '柠檬', '🍋', 'fruit', '个', 120, 2, 0.4, [14, 21], null, [7, 10]),
  d('pear', '梨|雪梨|香梨', '🍐', 'fruit', '个', 250, 2.5, 0.4, [14, 21], null, [5, 7]),
  d('grape', '葡萄|提子', '🍇', 'fruit', '串', 500, 12, 1.0, [5, 7], [300, 360], [1, 2]),
  d('strawberry', '草莓', '🍓', 'fruit', '盒', 300, 15, 1.4, [2, 3], [240, 300], [1, 1]),
  d('blueberry', '蓝莓', '🫐', 'fruit', '盒', 125, 12, 1.4, [7, 10], [240, 300], [1, 2]),
  d('watermelon', '西瓜|切开的西瓜|半个西瓜', '🍉', 'fruit', '个', 4000, 15, 0.4, [3, 5], null, [7, 14], { tip: '切开的西瓜请保鲜膜覆盖冷藏，1–2 天内吃完。' }),
  d('mango', '芒果', '🥭', 'fruit', '个', 300, 5, 0.9, [5, 7], [180, 240], [3, 5]),
  d('peach', '桃子|桃|油桃|水蜜桃', '🍑', 'fruit', '个', 200, 3, 0.6, [3, 5], null, [1, 2]),
  d('kiwi', '猕猴桃|奇异果', '🥝', 'fruit', '个', 100, 2, 0.6, [14, 21], null, [3, 7]),
  d('cherry', '樱桃|车厘子', '🍒', 'fruit', '盒', 250, 25, 1.4, [5, 7], null, [1, 2]),
  d('avocado', '牛油果|鳄梨', '🥑', 'fruit', '个', 180, 6, 2.5, [3, 5], null, [2, 4]),
  d('pineapple', '菠萝|凤梨', '🍍', 'fruit', '个', 1200, 8, 0.6, [3, 5], null, [2, 3]),

  // —— 肉类 ——
  d('pork', '猪肉|瘦肉|里脊|猪里脊|前腿肉|后腿肉|肉片|肉丝', '🥩', 'meat', '斤', 500, 16, 7.6, [1, 2], [120, 180], null, { risky: true, tip: RAW_MEAT }),
  d('porkbelly', '五花肉|三层肉', '🥓', 'meat', '斤', 500, 18, 7.6, [1, 2], [120, 180], null, { risky: true, tip: RAW_MEAT }),
  d('mince', '肉末|肉馅|猪肉馅|绞肉', '🥩', 'meat', '斤', 500, 16, 7.6, [1, 2], [90, 120], null, { risky: true, tip: '肉馅表面积大、细菌多，冷藏当天或次日用完。' }),
  d('ribs', '排骨|猪排骨|肋排', '🍖', 'meat', '斤', 500, 25, 7.6, [1, 2], [120, 180], null, { risky: true, tip: RAW_MEAT }),
  d('beef', '牛肉|牛腩|牛排|肥牛|肥牛卷', '🥩', 'meat', '斤', 500, 40, 60, [2, 3], [180, 360], null, { risky: true, tip: RAW_MEAT }),
  d('lamb', '羊肉|羊排|羊肉卷', '🍖', 'meat', '斤', 500, 40, 24, [2, 3], [180, 270], null, { risky: true, tip: RAW_MEAT }),
  d('chicken', '鸡肉|鸡胸肉|鸡胸|鸡腿|鸡翅|鸡块|整鸡', '🍗', 'meat', '斤', 500, 12, 6.1, [1, 2], [270, 360], null, { risky: true, tip: '禽肉冷藏 1–2 天；处理生禽后请洗手并分开砧板。' }),
  d('duck', '鸭肉|鸭腿|鸭', '🍗', 'meat', '斤', 500, 15, 6.1, [1, 2], [180, 270], null, { risky: true, tip: RAW_MEAT }),
  d('sausage', '香肠|火腿肠|腊肠|烤肠', '🌭', 'meat', '根', 60, 2, 7, [14, 21], [60, 90], [30, 60], { opened: [5, 7] }),
  d('bacon', '培根', '🥓', 'meat', '包', 200, 15, 7.6, [7, 10], [30, 60], null, { opened: [5, 7] }),
  d('ham', '火腿|午餐肉|火腿片', '🥫', 'meat', '包', 200, 10, 7.6, [14, 21], [30, 60], null, { opened: [3, 5] }),

  // —— 水产 ——
  d('fish', '鱼|鲈鱼|草鱼|鲫鱼|鲤鱼|鳕鱼|带鱼|鱼片', '🐟', 'seafood', '条', 600, 20, 5.4, [1, 2], [90, 180], null, { risky: true, tip: '鲜鱼冷藏 1–2 天；有腥臭、鱼眼浑浊、按压不回弹就别吃。' }),
  d('salmon', '三文鱼|鲑鱼', '🐟', 'seafood', '块', 200, 30, 6, [1, 2], [60, 90], null, { risky: true, tip: '生食三文鱼需购买可生食级别并当天食用。' }),
  d('shrimp', '虾|大虾|鲜虾|基围虾|虾仁', '🦐', 'seafood', '斤', 500, 40, 12, [1, 2], [90, 180], null, { risky: true, tip: '鲜虾极易变质，变黑、发软、有氨味请丢弃。' }),
  d('clam', '花甲|蛤蜊|扇贝|生蚝|牡蛎|贝类', '🦪', 'seafood', '斤', 500, 15, 5, [1, 1], [60, 90], null, { risky: true, tip: '贝类请当天食用并彻底加热，死贝不要吃。' }),
  d('squid', '鱿鱼|墨鱼|章鱼', '🦑', 'seafood', '只', 300, 15, 5, [1, 2], [90, 180], null, { risky: true }),
  d('crab', '螃蟹|蟹|大闸蟹', '🦀', 'seafood', '只', 250, 25, 8, [1, 1], [60, 90], null, { risky: true, tip: '死蟹不要吃，请购买当天蒸熟。' }),

  // —— 蛋类 ——
  d('egg', '鸡蛋|蛋|土鸡蛋|鸡子', '🥚', 'egg', '个', 55, 1, 4.7, [21, 35], null, [7, 10]),
  d('duckegg', '咸鸭蛋|鸭蛋|皮蛋|松花蛋', '🥚', 'egg', '个', 70, 2, 4.7, [21, 30], null, [14, 21]),

  // —— 乳品 ——
  d('milk', '牛奶|鲜牛奶|鲜奶|纯牛奶', '🥛', 'dairy', '盒', 250, 3, 3.2, [5, 7], null, null, { opened: [2, 3], tip: '鲜奶开封后 2–3 天内喝完；常温奶未开封可常温，开封后需冷藏。' }),
  d('yogurt', '酸奶|老酸奶', '🥛', 'dairy', '盒', 200, 4, 3.5, [10, 14], null, null, { opened: [1, 2] }),
  d('cheese', '奶酪|芝士|芝士片|马苏里拉', '🧀', 'dairy', '包', 200, 20, 24, [14, 30], [60, 90], null, { opened: [7, 14] }),
  d('butter', '黄油', '🧈', 'dairy', '块', 200, 20, 12, [30, 60], [180, 270], null, { opened: [21, 30] }),
  d('cream', '淡奶油|奶油|稀奶油', '🥛', 'dairy', '盒', 250, 15, 5, [7, 10], null, null, { opened: [3, 5] }),

  // —— 豆制品 ——
  d('tofu', '豆腐|嫩豆腐|老豆腐|北豆腐|南豆腐', '🧈', 'tofu', '盒', 350, 3, 3.2, [3, 5], [60, 90], null, { opened: [1, 2], tip: '开封后泡清水冷藏，每天换水，1–2 天内吃完。' }),
  d('driedtofu', '豆干|香干|豆腐干|千张|豆皮|腐竹', '🧈', 'tofu', '袋', 250, 4, 3.2, [5, 7], [60, 90], null),
  d('soymilk', '豆浆', '🥛', 'tofu', '瓶', 300, 3, 1, [1, 2], null, null, { tip: '现磨豆浆请当天喝完，需煮沸。' }),

  // —— 主食 ——
  d('rice', '剩米饭|米饭|剩饭|隔夜饭|白饭', '🍚', 'leftover', '碗', 200, 1, 4.5, [1, 1], [30, 30], null, { risky: true, tip: '剩米饭可能滋生蜡样芽孢杆菌：煮好后 2 小时内冷藏，1 天内吃完并彻底加热，不要常温放置。' }),
  d('bread', '面包|吐司|切片面包', '🍞', 'staple', '袋', 400, 10, 1.6, [5, 7], [60, 90], [3, 5], { loc: 'pantry' }),
  d('noodle', '面条|鲜面条|手擀面|乌冬面', '🍜', 'staple', '袋', 500, 5, 1.6, [3, 5], [30, 60], [1, 1]),
  d('drynoodle', '挂面|意面|意大利面|方便面|泡面', '🍝', 'staple', '把', 100, 1.5, 1.6, null, null, [180, 360]),
  d('dumpling', '饺子|速冻饺子|馄饨|汤圆', '🥟', 'staple', '袋', 500, 20, 4, [1, 2], [60, 90], null, { loc: 'freezer' }),
  d('bun', '馒头|包子|花卷', '🥟', 'staple', '个', 100, 1.5, 1.6, [2, 3], [30, 60], [1, 1]),
  d('tortilla', '饼|手抓饼|面饼|卷饼|年糕', '🫓', 'staple', '袋', 400, 10, 1.6, [5, 7], [60, 90], [1, 2]),

  // —— 剩菜 ——
  d('leftovermeat', '剩菜|剩的菜|隔夜菜|红烧肉|炖肉|剩肉', '🍱', 'leftover', '盘', 300, 15, 4, [2, 3], [30, 60], null, { risky: true, tip: '剩菜请晾到不烫后尽快冷藏，2–3 天内吃完，食用前彻底加热至滚烫。' }),
  d('leftoverveg', '剩的青菜|剩蔬菜|炒青菜', '🍱', 'leftover', '盘', 250, 5, 1, [1, 1], null, null, { risky: true, tip: '绿叶菜不建议隔夜，如已冷藏请次日吃完并热透。' }),
  d('soup', '剩汤|鸡汤|骨头汤|排骨汤', '🍲', 'leftover', '碗', 400, 6, 3, [2, 3], [60, 90], null, { risky: true, tip: '汤品请煮沸后冷藏，食用前再次煮沸。' }),
  d('takeout', '外卖|剩外卖|披萨|炸鸡', '🥡', 'leftover', '份', 400, 25, 4, [2, 3], [30, 60], null, { risky: true, tip: '外卖剩余请 2 小时内冷藏，食用前彻底加热。' }),

  // —— 调料酱料 ——
  d('soysauce', '酱油|生抽|老抽', '🍶', 'cond', '瓶', 500, 10, 1, [180, 360], null, [180, 360], { loc: 'pantry' }),
  d('vinegar', '醋|陈醋|香醋', '🍶', 'cond', '瓶', 500, 8, 1, [360, 720], null, [360, 720], { loc: 'pantry' }),
  d('oystersauce', '蚝油', '🍶', 'cond', '瓶', 500, 12, 2, [90, 180], null, null, { tip: '蚝油开封后请冷藏。' }),
  d('ketchup', '番茄酱', '🍅', 'cond', '瓶', 300, 8, 1.5, [180, 360], null, null),
  d('mayo', '沙拉酱|蛋黄酱', '🥫', 'cond', '瓶', 300, 12, 3, [60, 90], null, null),
  d('chilisauce', '辣椒酱|老干妈|豆瓣酱|郫县豆瓣', '🌶️', 'cond', '瓶', 300, 10, 1.5, [90, 180], null, [30, 60]),
  d('jam', '果酱|蜂蜜', '🍯', 'cond', '瓶', 300, 15, 1.5, [90, 180], null, [180, 360]),
  d('sesamepaste', '芝麻酱|花生酱', '🥜', 'cond', '瓶', 300, 15, 2.5, [90, 180], null, [60, 90]),
  d('pickle', '泡菜|榨菜|咸菜|酸菜|韩式泡菜', '🥬', 'cond', '袋', 200, 4, 1, [14, 30], null, [7, 14], { opened: [7, 14] }),

  // —— 饮品 ——
  d('juice', '果汁|橙汁', '🧃', 'drink', '瓶', 1000, 10, 1, [7, 10], null, null, { opened: [3, 5] }),
  d('beer', '啤酒', '🍺', 'drink', '罐', 500, 5, 1.1, [90, 180], null, [90, 180]),
  d('cola', '可乐|雪碧|汽水|苏打水', '🥤', 'drink', '罐', 330, 3, 0.5, [180, 270], null, [180, 270], { loc: 'pantry' }),

  // —— 其他 ——
  d('frozen', '冻品|速冻食品|冷冻食品', '🧊', 'other', '袋', 500, 15, 3, null, [90, 180], null),
  d('nuts', '坚果|花生|瓜子|核桃', '🥜', 'other', '袋', 200, 15, 2.5, [90, 180], [270, 360], [30, 60], { loc: 'pantry' }),
  d('chocolate', '巧克力', '🍫', 'other', '块', 100, 10, 19, [90, 180], null, [60, 90], { loc: 'pantry' }),
  d('cake', '蛋糕|奶油蛋糕|甜点', '🍰', 'other', '块', 150, 15, 3, [2, 3], [30, 60], null, { risky: true, tip: '含奶油的蛋糕请冷藏，1–2 天内吃完。' }),
];

/** 未识别食材的默认规则 */
export const UNKNOWN_DEF: IngredientDef = {
  key: 'unknown',
  name: '未知食材',
  aliases: [],
  emoji: '📦',
  cat: 'other',
  unit: '份',
  g: 200,
  price: 5,
  co2: 2,
  loc: 'fridge',
  days: { fridge: [3, 5], freezer: [30, 60], pantry: [2, 3] },
};

const byKey = new Map(INGREDIENTS.map((i) => [i.key, i]));
export function getDef(key: string): IngredientDef {
  return byKey.get(key) ?? UNKNOWN_DEF;
}

/** 别名 → key，按长度降序，便于最长匹配 */
export const ALIAS_INDEX: Array<[string, string]> = INGREDIENTS.flatMap((i) =>
  [i.name, ...i.aliases].map((a) => [a, i.key] as [string, string]),
).sort((a, b) => b[0].length - a[0].length);

/** 首页与办案台的快捷标签 */
export const QUICK_TAGS = ['egg', 'tomato', 'bokchoy', 'rice', 'milk', 'tofu', 'potato', 'pork', 'carrot', 'scallion', 'chicken', 'mushroom'];
