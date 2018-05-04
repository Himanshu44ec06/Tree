function  Tree(){

    this._root  = null;

    function Node(data){
        this._data = data; // key 
        this._guid = this._gGuid();
        this._parent = null;
        this._children = [];
        this._otherData = {
            _keyValue  : '',
            _mappedId : '',
            _function : {
                _nameFunction : '',
                _expectedInput : []
            }
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
            _parent._children.push(_node);
        }else {
            if(!this._root)
                this._root = _node;
            else  
               throw 'Tree already have root'
        }
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

}

function ResponseTree(){

    this._tree = null;

    


}