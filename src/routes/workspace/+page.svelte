<script lang="ts">
  import Drawer, { AppContent, Content, Header, Title, Subtitle } from '@smui/drawer';
  import Button, { Label } from '@smui/button';
  import TextEditor from '../../components/pageComponents/workspace/TextEditor.svelte';
  import TextSelection from '../../components/pageComponents/workspace/TextSelection.svelte';

  let active = 'Gray Kittens';
  let isDrawerOpen = false;

  function setActive(value: string) {
    active = value;
  }
</script>

<div>
  <Drawer variant="dismissible" open={isDrawerOpen} style="width: 300px">
    <Header>
      <Title>Super Drawer</Title>
      <Subtitle>It's the best drawer.</Subtitle>
    </Header>
    <Content>
        asdfd
    </Content>
  </Drawer>

  <AppContent class="app-content">
    <Button on:click={() => isDrawerOpen = !isDrawerOpen}>Toggle</Button>
    <TextEditor></TextEditor>
    <TextSelection></TextSelection>
  </AppContent>
</div>

<style>
  * :global(.app-content) {
    flex: auto;
    overflow: auto;
    position: relative;
    flex-grow: 1;
    padding-left: 50px;
  }
</style>
