<template>
    <div id="home">
        <div id="header">

        </div>
        <div id="content">
            <div>
                <div id="utils-input">
                    <span>共输入了{{ inputPreProcessedArr.length }}条</span>
                    <button @click="addSample">加载示例</button>
                    <button @click="content = ''" :disabled="!content.length">清空内容</button>
                </div>
                <textarea v-model.trim="content" placeholder="在这里粘贴或者需要输入去重的内容" autofocus></textarea>
            </div>
            <div>
                <div id="utils-output">
                    <div>
                        <label for="remove-slash-n">去除显式\n</label>
                        <input id="remove-slash-n" type="checkbox" v-model="removeVisibleSlashN">
                    </div>
                    <input v-model.trim="specifiedFilterChars" type="text" placeholder="指定去除的字符内容，空格分隔">
                    <span>去重后有{{ refinedContentArr.length }}条</span>
                    <button @click="copyContent" :disabled="!refinedContentStr.length">复制</button>
                </div>
                <textarea v-model="refinedContentStr" placeholder="这里将会显示去重后的内容，空格、换行、逗号都会被作为分割识别符号"
                          title="这里将会显示去重后的内容" readonly></textarea>
            </div>
        </div>
        <div id="footer">

        </div>
    </div>
</template>

<script lang="ts" setup>
import {computed, ref} from "vue";

const content = ref("")

const addSample = () => {
    content.value = `127.0.0.1
127.0.0.2:9999
127.0.0.3:3333
127.0.0.1`
}

const removeVisibleSlashN = ref(true)
const specifiedFilterChars = ref("")

/**
 * 字符串预处理
 * 已经使用的分隔符：空格，换行符，逗号
 */
const inputPreProcessedStr = computed(() => {
    let _ = content.value.replaceAll(/[\n\s,]+/g, "\n")
    if (removeVisibleSlashN.value) _ = _.replaceAll("\\n", "\n")
    if (specifiedFilterChars.value.length) {
        const s = specifiedFilterChars.value
        const regex = new RegExp(`(${s.replaceAll(/\s+/g, "|")})`, "g")
        _ = _.replaceAll(regex, "")
    }
    return _
})

const inputPreProcessedArr = computed(() => {
    const _ = inputPreProcessedStr.value.split("\n")
    return _.filter(_ => _)
})


const refinedContentArr = computed(() => {
    return Array.from(new Set(inputPreProcessedArr.value))
})
const refinedContentStr = computed(() => {
    return refinedContentArr.value.join("\n")
})

const copyContent = () => {
    if (!refinedContentStr.value) return alert("暂时没有可以复制的内容")
    try {
        navigator.clipboard.writeText(refinedContentStr.value)
        alert("已复制到剪切板")
    } catch (e) {
        alert("复制失败，请手动选择复制")
        alert(e)
    }
}
</script>
<style lang="scss">
#home {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    min-width: 420px;
}

#header, #footer {
    flex-shrink: 0;
}

#content {
    flex-grow: 1;
    display: grid;
    grid-template-columns: repeat(2, 48%);
    justify-content: space-around;
    padding: 1rem;
    box-sizing: border-box;

    > div {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;

        > div {
            display: flex;
            align-items: center;
            padding: 6px;
            flex-wrap: wrap;
            line-height: 1.8;

            > * {
                margin-right: 12px;
            }
        }

        > textarea {
            flex-grow: 1;
            display: block;
            width: 100%;
            height: 100%;
            outline: none;
            border-radius: 3px;
            padding: 12px;
            box-sizing: border-box;
            border: 1px solid #666;
            resize: none;
            font-family: ui-monospace serif;

            &:focus {
                box-shadow: 0 0 3px #999 inset;
            }
        }
    }

    label {
        user-select: none;
    }

    input {
        outline: none;
        flex-grow: 1;
        box-sizing: border-box;
        padding: 3px 6px;
    }
}

@media screen and (max-width: 1024px) {
    #content {
        display: flex;
        flex-direction: column;

        > div {
            flex-grow: 1;
            flex-shrink: 0;
            height: auto;
        }
    }
}
</style>
