<script lang="ts">
  export let connectionVisible: boolean;

  import ConnectionBox from "./ConnectionBox.svelte";

  let answer = "";
  let offer = "";

  const lc = new RTCPeerConnection();
  export const dataChannel = lc.createDataChannel("channel");
  lc.onicecandidate = () => {
    offer = JSON.stringify(lc.localDescription);
  };
  lc.createOffer().then((offer) => lc.setLocalDescription(offer));
</script>

{#if connectionVisible}
  <ConnectionBox
    bind:offer
    bind:answer
    editable="answer"
    bind:connectionVisible
    submitText="Connect"
    onSubmit={async () => {
      await lc.setRemoteDescription(JSON.parse(answer));
      connectionVisible = false;
    }}
    instructions
  />
{/if}
