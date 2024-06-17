let vStepFilter = new Vue({
  el: '#v-step-filter',
  data:{
    start: startDate,
    end: endDate,
    kind: kind,
    roomLoaded: false,
    item: "",
    //grades: gradesData,
    dateActive: false,
    prefActive: false,
    isprefActive:"",
    areas: areas,
    prefs: prefData,
    prefEast: prefEast,
    prefKinki: prefKinki,
    prefWest:  prefWest,
    prefname:"",
    roomActive: false,
    roomDatas:"",
    isroomActive:"",
    resActive:false,
    resData:"",
    courses:[{id:1 ,name:"中学受験"},{id:2 ,name:"高校受験準備"},{id:3 ,name:"高校受験"},{id:4 ,name:"大学受験準備"},{id:5 ,name:"大学受験"}],
    p_id : "",
    a_p_id : "",
    loadingData: false
  },
  methods: {
    selectPref: function(id,area){
      this.loadingData = true;  // データを読みこみ中かどうか
      this.resActive = false;
      this.dateActive = true;
      this.isprefActive = id;
      this.isroomActive = "";
      this.resData = "";
      this.roomDatas = [];

      //県名の取得（結果表示用）
      let prefinfo = "";
      if(area === "east"){
        prefinfo = this.prefEast.find(function(v) {return v.id === id; });
      }else if(area === "kinki"){
        prefinfo = this.prefKinki.find(function(v) {return v.id === id; });
      }else if(area === "west"){
        prefinfo = this.prefWest.find(function(v) {return v.id === id; });
      }else{
        prefinfo = this.prefs.find(function(v) {return v.id === id; });
      }
      
      this.prefname = prefinfo['name'];
      this.prefNameEn = prefinfo['nameEn'];
      // var uri = '/events-json'
      var uri = '/getCartData'
      +'?start='+this.start
      +'&end='+this.end
      +'&kind='+this.kind
      +'&prefEng='+this.prefNameEn;

      axios
      .get(uri)
      .then(function(res){
        this.loadingData = false;
        this.item = res.data['eventData'];
        const itemList = this.item[0].cartItem;
        const courseCode = [];
        const roomDataArray = [];
        let i = 0;  // 校舎オブジェクトが何番目か
        
        for(var info in itemList) {
          propSearch(itemList[info], courseCode, 'normal_code');
          propSearch(itemList[info], roomDataArray, courseCode[i]['normal_code']);
          roomDataArray[i].hasOwnProperty(courseCode[i]['normal_code']) && this.roomDatas.push(roomDataArray[i][courseCode[i]['normal_code']]);
          i++;
        }
        this.roomActive = true;
      }.bind(this))
      .catch(function(err){
        console.log(err)
      }.bind(this))
      .finally(function(){
      });
    },
    selectRoom: function(code){
      this.resData = "";
      this.resActive = true;
      this.isroomActive = code;
      this.resData = this.roomDatas.find(function(e) { return e.school_id === code; });
      this.p_id =  this.resData['product_id'];
      this.a_p_id = this.resData['id'];
    }
  }
})