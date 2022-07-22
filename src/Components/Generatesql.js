export default function Generatesql(nodes,edges) {
    let result=''
    console.log('structure',nodes)

    for(let obj of nodes){
        console.log("print:",obj.type)
        if(obj.type==="source" ){
            result += 'create table	';
            result += '`'+obj.data.label+'`(\n';
            for(let l of nodes){
                if(l.data.pNode){
                console.log("for l: ",((obj.id===l.data.pNode)&&(l.type==="col")));
                if((obj.id===l.data.pNode)&&(l.type==="col")){
                    result += 	'\t`'+l.data.label+'` '+l.data.value +' '+ l.data.n + ' '+l.data.key +',\n';
                }}
            }
            result+=');\n';
        }
        
        
    }
    for(let obj of edges){
        console.log("print:",obj.type)
        if(obj.type==="custom" ){
            result += 'alter table	\n';

            for(let tarcol of nodes){
                if(tarcol.id===obj.target){
               
                for(let tartable of nodes){
                if((tartable.id===tarcol.data.pNode)&&(tarcol.type==="col")){
                    result += 	'\t`'+tartable.data.label+'` add constraint `'+tartable.data.label+'_'+tarcol.data.label+'_foreign` foreign key(`'+tarcol.data.label+'`) references `';
                }}
            }}
                for(let srccol of nodes){
                    if(srccol.id===obj.source){

                for(let srctable of nodes){
                    if((srctable.id===srccol.data.pNode)&&(srccol.type==="col")){
                        result += srctable.data.label+'`(`'+srccol.data.label+'`);\n';
            }}
        }}
            
        }
        
        
    }
    
    console.log("The sql file will contain:\n",result)

    return result;
}