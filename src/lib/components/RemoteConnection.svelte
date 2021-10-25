<script lang="ts">
  export let onMessage: (ev: MessageEvent<any>) => any;
  export let connectionVisible = true;

  import ConnectionBox from "./ConnectionBox.svelte";

  let offer = "";
  let answer = "";
  let rdc: RTCDataChannel;

  const rc = new RTCPeerConnection();
  rc.onicecandidate = () => {
    answer = JSON.stringify(rc.localDescription);
  };
  rc.ondatachannel = (e) => {
    rdc = e.channel;
    rdc.onmessage = onMessage;
    rdc.onopen = () => {
      connectionVisible = false;
    };
  };
</script>

{#if connectionVisible}
  <ConnectionBox
    bind:offer
    bind:answer
    editable="offer"
    bind:connectionVisible
    submitText="Create Answer"
    onSubmit={async () => {
      await rc.setRemoteDescription(JSON.parse(offer));
      rc.createAnswer().then((answer) => rc.setLocalDescription(answer));
    }}
    closeable={false}
  />
{/if}
