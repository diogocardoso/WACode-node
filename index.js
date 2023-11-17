function WAFrame(){
    this.ano = function(){
        const dataAtual = new Date();
        return dataAtual.getFullYear();
    };

    this.count = function(arr){
        if(this.is_array(arr)){
            return arr.length;
        }else if(this.is_object(arr)){
            const tmp = Object.keys(arr);
            return tmp.length;
        }

        return 0;
    };

    this.compare = function(val_1, val_2, operation){
        switch (operation) {
            case '<':
                return ( val_1 < val_2 ) ? true : false;                
            case '<=':
                return ( val_1 <= val_2 ) ? true : false;                
            case '>':
                return ( val_1 > val_2 ) ? true : false;                
            case '>=':
                return ( val_1 >= val_2 ) ? true : false;                
            case '==':
                return ( val_1 == val_2 ) ? true : false;                
            case '===':
                return ( val_1 === val_2 ) ? true : false;
        }
    };
    
    this.check = function(req, itens){
        const tmp = {result:true};
    
        for(const i in itens){
            const k = itens[i], v = req[k];

            if(!this.is_valid(v)){
                tmp.result = false;
                if(tmp.error==undefined){tmp.error={};}
                tmp.error[k] = `não informado`;
            }
        }

        return tmp;
    };
    
    this.cpf = function(val){
        val = replace_all(['.','-'],['',''],val);
        let Soma, Resto;
        Soma = 0;
        if (val == "00000000000") return false;
    
        for (let i=1; i<=9; i++) Soma = Soma + parseInt(val.substring(i-1, i)) * (11 - i);
        Resto = (Soma * 10) % 11;
    
        if ((Resto == 10) || (Resto == 11))  Resto = 0;
        if (Resto != parseInt(val.substring(9, 10)) ) return false;
    
        Soma = 0;
        for (let i = 1; i <= 10; i++) Soma = Soma + parseInt(val.substring(i-1, i)) * (12 - i);
        Resto = (Soma * 10) % 11;
    
        if ((Resto == 10) || (Resto == 11))  Resto = 0;
        if (Resto != parseInt(val.substring(10, 11) ) ) return false;
    
        return true;
    };
    
    this.day = function(){
        let $date = new Date(),
            $dia= parseInt($date.getDate());
    
        return ($dia < 10) ? "0"+$dia: $dia;
    };
    
    this.date_now = function(){
        let $date = new Date(),
            $dia  = day(),
            $mes  = month(),
            $ano  = $date.getFullYear();
    
        return $ano + "-" + $mes + "-" + $dia;
    };
    
    this.date_us = function(data){
        if(this.in_string('/',data)){
            let $tmp = data.split("/");
    
            return $tmp[2] + "-" + $tmp[1] + "-" + $tmp[0];
        }
        return data;
    };

    this.date_diff = function(dt_1, dt_2){
        if(this.is_valid(dt_1) && this.is_valid(dt_2)){
            if(this.in_string('/',dt_1)){ dt_1 = this.date_us(dt_1); }
            if(this.in_string('/',dt_2)){ dt_2 = this.date_us(dt_2); }

            const $dt_1 = new Date(dt_1),
                $dt_2 = new Date(dt_2),
                $diff = Math.abs($dt_1.getTime() - $dt_2.getTime());

            return Math.ceil($diff / (1000 * 60 * 60 * 24));
        }

        return false;
    };

    this.date_last_day_month=(dt)=>{
        if(this.in_array('/',dt)){ dt = this.date_us(dt); }        
        const arr = this.explode('-', dt), date = new Date(parseInt(arr[0]), parseInt(arr[1]), 0);

        return date.getDate();
    };

    this.date_num_week = function(dt){
        if(this.is_valid(dt)){
            if(this.in_string('/', dt)){ dt = this.date_us(dt); }

            const arr = this.explode('-', dt), date = new Date(arr[0], arr[1], arr[2]);

            return date.getDay();
        }

        return false;
    };

    this.date_sum = function(dt, days){
        if(this.is_valid(dt)){
            if(this.in_string('/', dt)){ dt = this.date_us(dt); }
            let arr = this.explode('-', dt),
                a = parseInt(arr[0]),
                m = parseInt(arr[1]) - 1,
                d = parseInt(arr[2]),
                $date = new Date(a, m, d),
                $sum = $date.getDate() + parseInt(days);

                let $u_dia = new Date(a, (m + 1), 0);

                if($sum >= $u_dia){
                    let $n_dia = $sum - $u_dia,
                        $n_mes = ($m==12) ? 1 : ($m + 1);

                    $date.setDate($n_dia);
                    $date.setMonth($n_mes);
                }else{
                    $date.setDate($sum);
                }

                let $mes = ($date.getMonth() + 1), $dia = $date.getDate();

                if($mes<10){ $mes = "0" + $mes; }
                if($dia<10){ $dia = "0" + $dia; }

            return $date.getFullYear() + '-' + $mes + '-' + $dia;
        }

        return false;
    };
    
    this.datetime = function(){
        let formata = (val)=>{
                  if(parseInt(val) < 10){ val = `0${val}`; }
    
                  return val;
              },
              Data = new Date(),
              dia = formata(Data.getDate()),
              mes = formata(Data.getMonth() + 1),
              ano = Data.getFullYear(),
              time = `${formata(Data.getHours())}:${formata(Data.getMinutes())}:${formata(Data.getSeconds())}`;
    
              return `${ano}-${mes}-${dia} ${time}`;
    };

    this.explode = function(separator, str){ return str.split(separator); };
    
    this.implode=(separator, arr)=>{ return arr.join(separator); };

    this.in_array = function(val, arr){ return (arr.indexOf(val)>-1) ? true : false; };

    this.in_object = function(val, obj){ return (this.is_valid(obj[val])) ? true : false; };
    
    this.in_string = function(val, str){ return (this.is_string(str) && str.indexOf(val)>-1) ? true : false; };
    
    this.is_array = function(val){ return Array.isArray(val); };
    
    this.is_date = function(val){
        const patternValidaData = /^(((0[1-9]|[12][0-9]|3[01])([-.\/])(0[13578]|10|12)([-.\/])(\d{4}))|(([0][1-9]|[12][0-9]|30)([-.\/])(0[469]|11)([-.\/])(\d{4}))|((0[1-9]|1[0-9]|2[0-8])([-.\/])(02)([-.\/])(\d{4}))|((29)(\.|-|\/)(02)([-.\/])([02468][048]00))|((29)([-.\/])(02)([-.\/])([13579][26]00))|((29)([-.\/])(02)([-.\/])([0-9][0-9][0][48]))|((29)([-.\/])(02)([-.\/])([0-9][0-9][2468][048]))|((29)([-.\/])(02)([-.\/])([0-9][0-9][13579][26])))$/;
    
        if(!patternValidaData.test(val)){
            return false;
        }
    
        return true;
    };

    this.is_email=(val)=>{
        const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (val.match(validRegex)) {            
          return true;      
        } 
        return false;      
    };

    this.is_object = function(val){ return (this.is_valid(val) && typeof(val)==="object") ? true : false; };

    this.is_numeric = function(val){ return (typeof(val)==="number") ? true : false; };

    this.is_string = function(val){ return (typeof(val)==="string") ? true : false; };    
    
    this.is_valid = function(val){ return (val && val!==null && val!==undefined && val!=='NULL' && val!=='null' && val!=='FALSE' && val!=='false') ? true : false; };
        
    this.last_day_month = function(mes, ano){
            const date = new Date(ano, mes, 0);
    
            return date.getDate();
    };

    this.object_value=(obj, item)=>{
        let tmp = false;
        if(this.is_object(obj)){
            if(this.is_array(item)){
                let val = false;
                for(let k in item){
                    let v = item[k];

                    if(this.is_valid(obj[v])){
                        val = obj[v];
                        obj = val;
                    }else{
                        val=false;
                        break;
                    }
                }
                tmp = val;
            }else{
                if(this.is_valid(obj[item])){
                    tmp = obj[item];
                }
            }
        }

        return tmp;
    };

    this.object_search = function(obj, field, value){
        if(this.is_object(obj)){
            for (const key in obj ){
                const Item = obj[key];
                if(Item[field]!=undefined && Item[field] == value){
                    return Item;                    
                }
            }
        }

        return false;
    };

    this.month = function(){
        let $date = new Date(),
            $mes  = parseInt($date.getMonth()) + 1;
    
        return ($mes < 10) ? "0"+$mes : $mes;
    };
    
    this.min_string = function(min, str){
        return (str.length>=min) ? true : false;
    };

    this.max_string = function(max, str){
        return (str.length<=max) ? true : false;
    };

    this.replace_all = function($de, $para, $string){
        let $pos = "";
    
        if(is_array($de) && is_array($para)){
            $de.forEach(function($val, $key){
                $string = replace_all($val, $para[$key], $string);
            });
        }else{
            $pos = $string.indexOf($de);
    
            while($pos > -1)
            {
                $string = $string.replace($de, $para);
                $pos    = $string.indexOf($de);
            }
        }
    
        return $string;
    };
    
    this.time = function(){
        let $Date = new Date(),
            $formata = function($val){
                if($val < 10){ $val = "0" + $val; }
    
                return $val;
            };
    
        return $formata($Date.getHours()) + ':' + $formata($Date.getMinutes()) + ':' + $formata($Date.getSeconds());
    };
    
    this.token = function(){
       return require('./WAToken');
    };
}

module.exports = new WAFrame();