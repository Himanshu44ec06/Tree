function  Tree(){

    this._root  = null;

    function Node(data){
        this._data = data; // key 
        this._guid = _gGuid();
        this._parent = null;
        this._accessKey = null;
        this._children = [];
        this._otherData = {
            _type  : '',
            _mappedId : null,
            _function : null
        }

        function _gGuid() {
            function _s4() {
                return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
              }
              return _s4() + _s4() + '-' + _s4() + '-' + _s4() + '-' + _s4() + '-' + _s4() + _s4() + _s4();
        }
    }

    this.add = function(data,toNodeData){
        var _node = new Node(data);
        var _parent  =  toNodeData ? this.findBFS(toNodeData) :null;
        if(_parent) {
            _node._parent =  _parent._guid;
            if(_parent._accessKey == null)
              _node._accessKey =     _node._data.key;
            else 
                _node._accessKey = _parent._accessKey + "->" + _node._data.key ;
            _parent._children.push(_node);
        }else {
            if(!this._root)
                this._root = _node;
            else  
               throw 'Tree already have root'
        }
        return _node._guid;
    }

    this.findBFS = function(data){
        var _queue = [this._root];
        while(_queue.length){
            var _thisNode  = _queue.shift();
            if(_thisNode._guid === data)
                return  _thisNode;
            
            for(var i=0;i<_thisNode._children.length;i++){
                _queue.push(_thisNode._children[i]);
            }
        }
        return null;
    }

    this.addDataToNode = function(node,mappedId,functionData){
        var _queue = [this._root];
        var  _found =  false;
        while(_queue.length){
            var _thisNode  = _queue.shift();
            
            if(_thisNode._guid === node){ 
                _found =  true;
                if(mappedId)
                    _thisNode._otherData._mappedId = mappedId;
                if(functionData)
                    _thisNode._otherData._function  = functionData;
            } 
            
            for(var i=0;i<_thisNode._children.length;i++){
                _queue.push(_thisNode._children[i]);
            }
            return  _found;
        } 
    }

}

function ResponseTree(){
    this.ConvertToTree = function(data){
        if(Array.isArray(data))
            throw 'Array  is  not Supported'

        var _tree = new Tree();
        var _root = _tree.add(''); //  intiating tree
        _childrenDataToTree(data,_tree,_root);
        return _tree;
     
    }



    this.CompareJson  = function(oldjson,newJson){
       return _comparingArray(oldjson,newJson);

    }


    function _comparingArray (dataLeft,dataRight){
        var _queue = Object.keys(dataLeft);
        while(_queue.length){
                var  _key  =  _queue.shift();
                if(dataRight[_key] == undefined  ||  ((typeof  dataLeft[_key]) != (typeof dataRight[_key])) )
                   return  false;
                
                if(!Array.isArray(dataLeft[_key])){
                        switch(typeof  dataLeft[_key]) {
                            case 'object': 
                           var retunOut =  _comparingArray(dataLeft[_key],dataRight[_key]);
                           if(!retunOut)
                              return false;
                          break;
                                
                        }
                }
                

        }
        return true;
    }


    this.ConvertToJson = function(tree){
        var  _jsonObject  = _childrenDataToJson(tree._root._children);
        return  _jsonObject;
    }


    function _childrenDataToJson(data){
        var  _jsonObject = {};
       
        while(data.length){
            var _item  =  data.shift();
            _jsonObject[_item._data.key] =  _item._children.length > 0? _childrenDataToJson(_item._children) :  _item._data.data;
        }
        return  _jsonObject;
    }

    function  _childrenDataToTree(data,_tree,_parent) {
            
        var _queue = Object.keys(data);
        while(_queue.length){
            var _key  = _queue.shift();
                if(!Array.isArray(data[_key])){ //  currently  excluding array  type
                    switch(typeof data[_key]){
                        case 'object': 
                          var _iParent =  _tree.add({key:_key,data:null},_parent);
                          _childrenDataToTree(data[_key],_tree,_iParent);
                        break;
                        default : 
                            _tree.add({key:_key,data : data[_key]},_parent);
                        break;

                    }
                }
        }
    }


}

/*
try{
var json  =  JSON.parse('{"headers"{"Content-Type":"application/json","client_secret":"abcd","client_id":"abcd"},"response":{"a":1,"b":2,"c":{"a":1}}}'); }
catch(ex){
    console.log(ex.__proto__.name);
}
*/


var _item  = new ResponseTree();
var  tree =_item.ConvertToTree({
    headers  : {
      'Content-Type' : 'application/json',
      'client_secret' : 'abcd',
      'client_id' : 'abcd'},response:{a:1,b:2,c:{a:1}}});
console.log(JSON.stringify(tree));
var  json  =  _item.ConvertToJson(tree);
console.log(_item.CompareJson({a:1,b:2,c:{a:1,b:2}},{a:1,b:2,c:{a:1,b:3}}));
