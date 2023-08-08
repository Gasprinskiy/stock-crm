import { NIcon } from "naive-ui"
import { Component, VNode, h } from "vue"

export const useRenderIcon = () : (icon: Component) => () => VNode => {
    return (icon: Component) => {
        return () => h(NIcon, null, { default: () => h(icon) })
    } 
}
  