<template>
  <div v-loading="menuData.length === 0" :class="['sidebar-container', showLogo ? 'has-logo' : '']">
    <Logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper" :class="[device === 'mobile' ? 'mobile' : 'pc']">
      <el-menu
        router
        unique-opened
        mode="vertical"
        class="select-none outer-most"
        :collapse="isCollapse"
        :default-active="route.path"
        :collapse-transition="false"
        @select="(indexPath) => menuSelect(indexPath, routers)"
      >
        <sidebar-item
          v-for="routes in menuData"
          :key="routes.path"
          :item="routes"
          :base-path="routes.path"
          class="select-none outer-most"
        />
      </el-menu>
    </el-scrollbar>

    <LeftCollapse
      v-if="device !== 'mobile'"
      :is-active="pureApp.sidebar.opened"
      @toggleClick="toggleSideBar"
    />
  </div>
</template>

<script setup lang="ts">
  import Logo from './logo.vue';
  import { useRoute } from 'vue-router';
  import { emitter } from '@/utils/mitt';
  import SidebarItem from './sidebarItem.vue';
  import LeftCollapse from './leftCollapse.vue';
  import { useNav } from '@/layout/hooks/useNav';
  import { storageLocal } from '@pureadmin/utils';
  import { ref, unref, computed, watch, onBeforeMount } from 'vue';
  import { findRouteByPath, getParentPaths } from '@/router/utils';
  import { usePermissionStoreHook } from '@/store/modules/permission';
  import { useUserStore } from '@/store/modules/user';

  const route = useRoute();
  const showLogo = ref(
    storageLocal().getItem<StorageConfigs>('responsive-configure')?.showLogo ?? true,
  );

  const { routers, device, pureApp, isCollapse, menuSelect, toggleSideBar } = useNav();

  const subMenuData = ref([]);

  const menuData = computed(() => {
    return pureApp.layout === 'mix' && device.value !== 'mobile'
      ? subMenuData.value
      : unref(filtersMenus);
  });

  const filtersMenus = computed(() => {
    const { roles } = useUserStore();
    const { wholeMenus } = usePermissionStoreHook();
    const ret = wholeMenus.filter((item) => {
      const { role } = item.meta;
      return !role || roles.includes(role);
    });
    return ret;
  });

  function getSubMenuData(path: string) {
    // path的上级路由组成的数组
    const parentPathArr = getParentPaths(path, unref(filtersMenus));
    // 当前路由的父级路由信息
    const parenetRoute = findRouteByPath(parentPathArr[0] || path, unref(filtersMenus));
    if (!parenetRoute?.children) return;
    subMenuData.value = parenetRoute?.children;
  }

  getSubMenuData(route.path);

  onBeforeMount(() => {
    emitter.on('logoChange', (key) => {
      showLogo.value = key;
    });
  });

  watch(
    () => [route.path, filtersMenus],
    () => {
      getSubMenuData(route.path);
      menuSelect(route.path, routers);
    },
  );
</script>

<style scoped>
  :deep(.el-loading-mask) {
    opacity: 0.45;
  }
</style>
