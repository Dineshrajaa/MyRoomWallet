var uiController=(function(uiController){
	//Model to Enhance the UI
	enhanceUI=function(){
			$("[data-role=panel]").panel().enhanceWithin();//Initialize the External panel
	};
	printBalance=function(amountinwallet){

		$("#currentbalance").text(amountinwallet);
	};
	return {
		enhanceUI:enhanceUI,
		printBalance:printBalance
	};

}(window.uiController=window.uiController||{}));


var dataBaseController=(function(dataBaseController){
	//Model to Create/Insert/Update/Delete Data's in WebSQL
	var db;
	setupDb=function(callback){
		db=window.openDatabase("myroomwallet",1.0,"myroomwallet",5242880);
		db.transaction(initDb,dbErrorHandler,callback);
	};
	initDb=function(t){
		//t.executeSql('drop table wallet');
		t.executeSql('create table  if not exists wallet\
		(id integer primary key,addedate date,amount number)');
		console.log("Created Wallet table");
		t.executeSql('create table if not exists expense\
			(id integer primary key,purchasedate date,amount number)');
	};
	dbErrorHandler=function(e){
		console.log('DB Error');
		console.dir(e);
	};
	insertMoney=function(){
		db.transaction(function(t){
			t.executeSql('insert into wallet(addedate,amount) values(?,?)\
			',[$("#datefield").val(),$("#amountfield").val()],function(){
				alert("Inserted Data Successfully");
			}),dbErrorHandler
		});
	};
	fetchBalance=function(){
		db.transaction(function(t){
			t.executeSql('select * from wallet',[],function(t,result){
				console.log(result.rows.length);
				if(result.rows.length!==0){
					var row=result.rows.item(result.rows.length-1);
					uiController.printBalance(row.amount);
					// $("#currentbalance").text(row.amount);
				}
				//else $("#currentbalance").text(0);
			},dbErrorHandler);
		});
	};
	return{
		setupDb:setupDb,
		insertMoney:insertMoney,
		fetchBalance:fetchBalance
	};
}(window.dataBaseController=window.dataBaseController||{}));



$(document).ready(function(){
			uiController.enhanceUI();
			dataBaseController.setupDb();
		});
$(document).on("pagebeforeshow","#addmoney-page",function(){
	dataBaseController.fetchBalance();
});
