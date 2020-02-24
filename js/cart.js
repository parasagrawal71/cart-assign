var myData = [];
var cart = [{"total" : 0, "delivery" : 0, "payable" : 0}];

function show(){
    fetch('http://demo4257344.mockable.io/product.json')
    .then(res => res.json())    
    .then(data => myData = data)
    .then(myData => {
        for(let i in myData){
            myData[i].availability.count = 0;
        }
        for(let j in myData){
            myData[j].btn = {};
        }
        for(let j in myData){
            myData[j].btn.minus = function(){
                return dec(j);
            };
            myData[j].btn.plus = function(){
                return inc(j);
            };
        }
        return myData;
    })
    .then( myData => {

        for(let ele of myData){
        
        let main_node = document.querySelector('.product');

            let product_node = document.createElement('div');
            product_node.classList.add("product_item");

                let img_node = document.createElement('div');
                img_node.classList.add("product_item_image");
                let img_node_tag = document.createElement('img');
                img_node_tag.classList.add("product_item_image_src");
                img_node_tag.setAttribute('src', ele.product_meta.img )
                //img_node_tag.src = ele.product_meta.img;
                img_node.appendChild(img_node_tag);
                product_node.appendChild(img_node);

                let product_detail_node = document.createElement('div');
                product_detail_node.classList.add("product_item_details");

                    let name_node = document.createElement('div');
                    name_node.classList.add("product_item_name");
                    let name_text = document.createTextNode(` ${ele.product_meta.title}`);
                    name_node.appendChild(name_text);
                    product_detail_node.appendChild(name_node);

                    let price_node = document.createElement('div');
                    price_node.classList.add("product_item_price");
                    let price_text = document.createTextNode(`Rs. ${ele.pricing.mrp}`);
                    price_node.appendChild(price_text);
                    product_detail_node.appendChild(price_node);

                    let delivery_node = document.createElement('div');
                    delivery_node.classList.add("product_item_delivery");
                    let charge = ele.pricing.delivery_charge;
                    let ans =  charge!=0? charge : "FREE";
                    let delivery_text = document.createTextNode("Delivery: "+ans);
                    delivery_node.appendChild(delivery_text);
                    product_detail_node.appendChild(delivery_node);

                    
                    let ind = myData.indexOf(ele);

                    let num_node = document.createElement('div');
                    num_node.classList.add("product_item_num");
                        let minus_node = document.createElement('div');
                        minus_node.classList.add("minus_btn");
                            let minus_btn = document.createElement('button');
                            let minus_text = document.createTextNode('-');
                            minus_btn.appendChild(minus_text);
                            minus_node.appendChild(minus_btn);//if
                            //minus_btn.setAttribute('onclick',ele.btn.minus()); --NOT WORKING
                            minus_btn.addEventListener('click',ele.btn.minus); 
                                //2nd parameter of eventListener is function without quotes around and w/o parenthesis->just the function name                        
                            

                        let value_node = document.createElement('div');
                        value_node.classList.add("product_item_num_value");
                        let value_node_text = document.createTextNode(ele.availability.count);
                        value_node.appendChild(value_node_text);

                        
                        let plus_node = document.createElement('div');
                        plus_node.classList.add("plus_btn");
                            let plus_btn = document.createElement('button');
                            let plus_text = document.createTextNode('+');
                            plus_btn.appendChild(plus_text);
                            plus_node.appendChild(plus_btn);//if
                            //plus_btn.setAttribute('onclick',`inc(${ind})`); --NOT WORKING
                            plus_btn.addEventListener('click',ele.btn.plus); 

                        let avail_node = document.createElement('div');
                        avail_node.classList.add("available");

                        num_node.appendChild(minus_node);
                        num_node.appendChild(value_node);
                        num_node.appendChild(plus_node);
                        num_node.appendChild(avail_node);
                        

                    product_detail_node.appendChild(num_node);

                product_node.appendChild(product_detail_node);
                main_node.appendChild(product_node);


        }

        
        document.querySelector('.price_details_total_value').innerHTML = `Rs. ${cart[0].total}`;
        document.querySelector('.price_details_delivery_value').innerHTML = `Rs. ${cart[0].delivery}`;
        document.querySelector('.price_details_payable_value').innerHTML = `Rs. ${cart[0].payable}`;

    })
    .catch(error => console.log(error));
}


function dec(index){
  
    let ele = myData[index];
    if( ele.availability.count > 0){
        ele.availability.count-=1;
        document.getElementsByClassName('product_item_num_value')[index].childNodes[0].nodeValue = ele.availability.count;  
        let ch = '-';
        update(index,ch);
    }
}

function inc(index){

    let ele = myData[index];
    let max = ele.purchase_instructions.max_purchase_limit;
    if( ele.availability.count < max){
        ele.availability.count+=1;
        document.getElementsByClassName('product_item_num_value')[index].childNodes[0].nodeValue = ele.availability.count;  
        let ch = '+';
        update(index,ch);
    }
}

function update(index,ch){

        let tot = myData[index].pricing.mrp;
        let del = myData[index].pricing.delivery_charge;

        if(ch == '+'){
            cart[0].total += tot;
            cart[0].delivery += del;
            cart[0].payable = cart[0].total + cart[0].delivery;
        }
        else{
            cart[0].total -= tot;
            cart[0].delivery -= del;
            cart[0].payable = cart[0].total + cart[0].delivery;
        }
        
        document.querySelector('.price_details_total_value').innerHTML = `Rs. ${cart[0].total}`;
        document.querySelector('.price_details_delivery_value').innerHTML = `Rs. ${cart[0].delivery}`;
        document.querySelector('.price_details_payable_value').innerHTML = `Rs. ${cart[0].payable}`;

}


function check(){
    
    let pin = document.querySelector(".product_header_pincode_search > input").value;

    for(let ele of myData){
        let pins_arr = ele.availability.unavailable_pincodes;
        let ind = myData.indexOf(ele);

        const parent = document.getElementsByClassName("available")[ind];
        while (parent.firstChild) {
            parent.firstChild.remove();
        }

        if(!pins_arr.includes(pin)){
            let text_node = document.createTextNode("Unavailable for this pincode");
            let div_node = document.getElementsByClassName('available')[ind];
            div_node.appendChild(text_node);
        }
    }
    
}