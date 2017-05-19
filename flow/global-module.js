declare module 'weex-dingtalk-polyfills'{
  declare var weexInstanceVar:Object;
  declare export default typeof weexInstanceVar;
}

declare module "weex-dingtalk-runtime"{
  declare var ship:Object;
  declare export default typeof ship;
}

declare module 'weex-dingtalk-exec'{
  declare var exec:Function;
  declare export default typeof exec;
}
