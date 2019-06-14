function formatComponentName(vm) {
  if (vm.$root === vm) return 'root';
  var name = vm._isVue
      ? (vm.$options && vm.$options.name) ||
      (vm.$options && vm.$options._componentTag)
      : vm.name;
  return (
      (name ? 'component <' + name + '>' : 'anonymous component') +
      (vm._isVue && vm.$options && vm.$options.__file
          ? ' at ' + (vm.$options && vm.$options.__file)
          : '')
  );
}

export {
  formatComponentName
}