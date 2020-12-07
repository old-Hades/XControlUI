<template>
  <div id="box">
    <iframe :src="url" width="100%" height="800" frameborder="0" scrolling="auto" id="iframename" name="iframename"></iframe>
  </div>
</template>

<script>
import { serverUrl } from '../../utils/config'
export default {
  data() {
    return {
      url: serverUrl.journalUrl+'/app/kibana#/discover?_g=(refreshInterval:(\'$$hashKey\':\'object:1467\',display:Off,pause:!f,section:0,value:0),time:(from:now%2Fd,mode:quick,to:now%2Fd))&_a=(columns:!(host,message),index:\'1210ea40-12ae-11eb-a705-31162fff5c8e\',interval:auto,query:(language:lucene,query:(query_string:(analyze_wildcard:!t,default_field:\'*\',query:\'*\'))),sort:!(\'@timestamp\',desc),uiState:(spy:(mode:(name:table))))',
    }
  },
  created() {
    console.log(this.url)
  },
}
</script>

<style></style>
