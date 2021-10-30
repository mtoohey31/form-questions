<script lang="ts">
   // @ts-ignore
   window.onSignIn = (googleUser) => {
      oAuthToken = googleUser.getAuthResponse(true).access_token;
   };

   export let oAuthToken: string;
</script>

<svelte:head>
   <script src="https://apis.google.com/js/platform.js" async defer></script>
   <meta
      name="google-signin-client_id"
      content={import.meta.env.VITE_GAPI_CLIENT_ID}
   />
</svelte:head>

<div
   class="g-signin2"
   data-longtitle="true"
   data-onsuccess="onSignIn"
   data-theme="dark"
/>
