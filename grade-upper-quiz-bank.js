/* Grade 4-6 question bank extension. */
(function addGradeUpperQuizBank(){
  if(typeof quizBank==='undefined')return;
  const bank={
    math:[
      {grade:4,difficulty:'medium',title:'四年级数学挑战',question:'356 + 487 = ?',options:['733','843','853','863'],answer:1},
      {grade:4,difficulty:'medium',title:'四年级数学挑战',question:'24 × 6 = ?',options:['124','134','144','154'],answer:2},
      {grade:4,difficulty:'medium',title:'四年级数学挑战',question:'长方形长14厘米、宽8厘米，周长是多少？',options:['22厘米','44厘米','112厘米','28厘米'],answer:1},
      {grade:5,difficulty:'hard',title:'五年级数学挑战',question:'3.6 + 4.75 = ?',options:['7.35','8.25','8.35','9.35'],answer:2},
      {grade:5,difficulty:'hard',title:'五年级数学挑战',question:'1/2 + 1/4 = ?',options:['1/6','2/6','3/4','1'],answer:2},
      {grade:5,difficulty:'hard',title:'五年级数学挑战',question:'平行四边形底12厘米、高7厘米，面积是多少？',options:['19平方厘米','38平方厘米','84平方厘米','168平方厘米'],answer:2},
      {grade:6,difficulty:'expert',title:'六年级数学挑战',question:'一个数的25%是18，这个数是多少？',options:['45','54','72','90'],answer:2},
      {grade:6,difficulty:'expert',title:'六年级数学挑战',question:'甲乙人数比3:5，总人数64，甲有多少人？',options:['24','30','32','40'],answer:0},
      {grade:6,difficulty:'expert',title:'六年级数学挑战',question:'圆半径4厘米，面积约是多少？π取3.14',options:['12.56','25.12','50.24','100.48'],answer:2}
    ],
    logic:[
      {grade:4,difficulty:'medium',title:'四年级逻辑挑战',question:'图案：叶、花、铃、叶、花、铃，下一个是？',options:['叶','花','铃','灯'],answer:0},
      {grade:4,difficulty:'medium',title:'四年级逻辑挑战',question:'B比A重，C比B重，D比A轻，最重的是？',options:['A','B','C','D'],answer:2},
      {grade:5,difficulty:'hard',title:'五年级逻辑挑战',question:'数列1、4、9、16、25，下一个是？',options:['30','32','36','49'],answer:2},
      {grade:6,difficulty:'expert',title:'六年级逻辑挑战',question:'四个数平均数15，其中三个是10、12、18，第四个是？',options:['15','20','22','25'],answer:1}
    ],
    science:[
      {grade:4,difficulty:'medium',title:'四年级科学挑战',question:'声音是由物体怎样产生的？',options:['振动','睡觉','变色','发芽'],answer:0},
      {grade:4,difficulty:'medium',title:'四年级科学挑战',question:'下列哪种材料更容易导电？',options:['铜线','橡皮','木头','塑料尺'],answer:0},
      {grade:5,difficulty:'hard',title:'五年级科学挑战',question:'电路中，小灯泡发光需要什么？',options:['形成闭合回路','只放在桌上','剪断导线','没有电源'],answer:0},
      {grade:6,difficulty:'expert',title:'六年级科学挑战',question:'地球公转主要造成什么现象？',options:['四季变化','昼夜交替','声音传播','磁铁消失'],answer:0}
    ],
    language:[
      {grade:4,difficulty:'medium',title:'四年级语文挑战',question:'“他跑得像风一样快。”使用了什么修辞？',options:['比喻','反问','设问','对偶'],answer:0},
      {grade:5,difficulty:'hard',title:'五年级语文挑战',question:'“虽然路很远，但是大家没有放弃。”表示什么关系？',options:['转折','因果','递进','条件'],answer:0},
      {grade:6,difficulty:'expert',title:'六年级语文挑战',question:'下列哪个成语表示坚持不懈？',options:['锲而不舍','半途而废','东张西望','垂头丧气'],answer:0}
    ],
    english:[
      {grade:4,difficulty:'medium',title:'Grade 4 English Challenge',question:'Choose the correct sentence.',options:['He likes apples.','He like apples.','He liking apples.','He are apples.'],answer:0},
      {grade:5,difficulty:'hard',title:'Grade 5 English Challenge',question:'Choose the past tense of buy.',options:['bought','buyed','buys','buying'],answer:0},
      {grade:6,difficulty:'expert',title:'Grade 6 English Challenge',question:'Choose the correct passive sentence.',options:['The map was found by Mimi.','The map found Mimi.','Mimi was found the map.','Found was the map Mimi.'],answer:0}
    ],
    riddle:[
      {grade:4,difficulty:'medium',title:'四年级谜语挑战',question:'门里有口，猜一字。',options:['问','间','闪','闻'],answer:0},
      {grade:5,difficulty:'hard',title:'五年级谜语挑战',question:'王先生和白先生坐在石头上，猜一字。',options:['碧','珀','皇','砰'],answer:0},
      {grade:6,difficulty:'expert',title:'六年级谜语挑战',question:'雨落田上响隆隆，猜一字。',options:['雷','雪','霜','雾'],answer:0}
    ]
  };
  Object.entries(bank).forEach(([key,questions])=>{if(!Array.isArray(quizBank[key]))quizBank[key]=[];quizBank[key].push(...questions);});
})();
