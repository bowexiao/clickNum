
export class Utils  extends cc.Component{

    private static pools = null;

    public static shuffule(arr){
        let length = arr.length;

        for (let i = 0; i < length - 1; i++) {
            let index = Math.floor(Math.random() * (length - i));
            let temp = arr[index];
            arr[index] = arr[length - i - 1];
            arr[length - i - 1] = temp;
        }

        return arr;
    };
    
    public static getPoolType(type){
        if(!this.pools){
            this.pools = {};
        }

        let pool = this.pools[type];

        if(!pool){
            pool = new cc.NodePool(type);
            this.pools[type] = pool;
        }

        let node = pool.get();
        return node;
    }

    public static putPoolType(type,node){
        if(!this.pools){
            this.pools = {};
        }

        let pool = this.pools[type];
        if(!pool){
            this.getPoolType(type);
            pool = this.pools(type);
        }
        pool.put(node);
    }

}
