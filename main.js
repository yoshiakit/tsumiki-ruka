//ver 1.1.2
//Last updated on 13:50 Jan. 20th 2020

Vue.config.devtools = true;
var calculation = new Vue({
	el:"#calculation",
	data:{ //初期値を格納する
		packWidth:30,
		packDepth:40,
		packHeight:50,
		packWeight:10,
		surmountable:true, //荷物を重ねてもよいか
		turnable:false, //荷物の向きを変えても良いか
		carName:"軽バン",
	},
	computed:{ //計算処理を記述する
//I.入力受付系
		carSpec:function(){
			//幅, 奥行き, 高さ, 耐荷重量の順番で格納。
			//耐荷重量も配列に持たせているのは、後に一般貨物用に開発するときのため。
			let a = [];
			switch(this.carName){
				case("軽バン"):
		         	console.log("車格：軽バンを選択")
		         	a =  [130,180,120,350];
		         	break;
		        case("幌車"):
		         	console.log("車格：幌車を選択")
		         	a = [130,180,160,350];
		         	break;
		         case("2トン車"):
		         	console.log("車格：2トン車を選択")
		         	a = [160,310,200,2000];
		         	break;
		         case("4トン車"):
		         	console.log("車格：4トン車を選択")
		         	a = [210,620,230,3000];
		         	break;
		         case("10トン車"):
		         	console.log("車格：10トン車を選択")
		         	a = [240,900,250,9000];
		         	break;
		        case("2トン車ワイド"):
		         	console.log("車格：2トン車ワイドを選択")
		         	a = [230,310,200,2000];
		         	break;
		         case("2トン車ロング"):
		         	console.log("車格：2トン車ロングを選択")
		         	a = [160,720,200,2000];
		         	break;
		        case("4トン車ワイド"):
		         	console.log("車格：4トン車ワイドを選択")
		         	a = [230,620,230,3000];
		         	break;
		        case("4トン車ロング"):
		         	console.log("車格：4トン車ロングを選択")
		         	a = [210,720,230,3000];
		         	break;
		        default:
		         	console.log("車格：デフォルト値(軽バンのもの)")
		         	a = [130,180,120,350];
		         	break;
			}
			return a
		},
		packSpec:function(){
			return [this.packWidth, this.packDepth, this.packHeight, this.packWeight]
		},
//II.評価用
		maximumPacks:function(){
			return  Math.floor(this.carSpec[3] / this.packSpec[3])
		},
//III.計算
		loadablePacks:function(){
			let tempTotalPacks = [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]]; //計算過程で[1面搭載数、垂直方向への積み重ね可能数、合計個数]6種類まで格納する、2次元配列。
			let totalPacks = []; //最終的な[1面搭載数、垂直方向への積み重ね可能数、合計個数]を(1種のみ)格納する、1次元配列。

			let d = 0; //計算用			
			if (this.turnable == true){
				console.log("荷物の向きの変更も考慮してfor文処理")
				for(j = 1; j < 3; j++){
					for(i = 0; i < 3; i ++){
						console.log(d);
						tempTotalPacks[d][0] = Math.floor(this.carSpec[0]  / this.packSpec[(i)%3])*
							Math.floor(this.carSpec[1] / this.packSpec[(i+1+j)%3]);
						tempTotalPacks[d][1] = Math.floor(this.carSpec[2] / this.packSpec[(i+2+(2*j))%3]);
						tempTotalPacks[d][2] = tempTotalPacks[d][0]*tempTotalPacks[d][1]
						d = d + 1;
					}
				}
			} else {
				console.log("荷物の向きの変更は考慮せず、for文処理")
				for(i = 0; i < 2; i ++){
					console.log(d);
					tempTotalPacks[d][0] = Math.floor(this.carSpec[0]  / this.packSpec[(i)%2])*
						Math.floor((this.carSpec[1]) / this.packSpec[(i+1)%2]);
					tempTotalPacks[d][1] = Math.floor(this.carSpec[2] / this.packSpec[2]);
					tempTotalPacks[d][2] = tempTotalPacks[d][0]*tempTotalPacks[d][1];	
					d = d + 1;
				}
			}

			const tempArray = [];
			for(m=0,n = tempTotalPacks.length; m < n; m++){
				tempArray.push(tempTotalPacks[m][2])
			}
			// let maxIndex = tempArray.indexOf(Math.max(tempArray[0,1,2,3,4,5]));
			let maxIndex = tempArray.indexOf(Math.max(
				tempArray[0],
				tempArray[1],
				tempArray[2],
				tempArray[3],
				tempArray[4],
				tempArray[5]));

			console.log("tempArray")
			console.log(tempArray)
			console.log(Math.max(tempArray[0,1,2,3,4,5]))
			console.log(maxIndex)
			maxIndex = maxIndex;

			console.log(tempTotalPacks[maxIndex][0])



			if(this.maximumPacks < tempTotalPacks[maxIndex][0]){
				//つまり、1面に敷き詰めただけでもう重量オーバー
				console.log("1面に敷き詰めただけでもう重量オーバーなので調整")
				totalPacks[0] = this.maximumPacks;
				totalPacks[1] = 1; //1段しか詰めない
				totalPacks[2] = totalPacks[0];
			} else if (this.maximumPacks < tempTotalPacks[maxIndex][2]){
				//つまり、1面には敷き詰めても良いが、積めるだけ積んでしまうと重量オーバーになってしまう
				console.log("1面に敷き詰めても問題ないが、縦に積めるだけ積んでしまうと重量オーバーになってしまうので調整")
				totalPacks[0] = tempTotalPacks[maxIndex][0]; //1面はOK
				totalPacks[1] = Math.ceil(this.maximumPacks / totalPacks[0]);
				totalPacks[2] = this.maximumPacks;
			} else {
				totalPacks[0] = tempTotalPacks[maxIndex][0];
				totalPacks[1] = tempTotalPacks[maxIndex][1];
				totalPacks[2] = tempTotalPacks[maxIndex][2];
			}
			
			//temp初期化
			tempTotalPacks = [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]]
			console.log("tempTotalPacksを初期化した。tempTotalPacks:")
			console.log(tempTotalPacks)
			console.log("totalPacks:")
			console.log(totalPacks)
			return totalPacks;
	
		},
	},
})