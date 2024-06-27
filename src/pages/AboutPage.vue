<template>
  <div>
    <h1>Über Punkalender</h1>
    <p>Diese Website ist noch gaanz am Anfang der Entwicklung :-). Mein Ziel ist es, gerade kleinere Punk Events besser
      zu pushen, auch ausserhalb der Chats.</p>
    <p>Du möchtest dieses Projekt unterstützen, hast Fragen oder einen Fehler entdeckt? Kontaktiere uns gerne über
      <el-popconfirm title="Mail kopieren?" confirm-button-text="Mail kopieren" @confirm="copyEmail">
        <template #reference>
          <a href="javascript:void(0)">admin@punkalender.ch</a>
        </template>
      </el-popconfirm>.
    </p>
  </div>
</template>

<script setup>
import { ElNotification } from 'element-plus'
import 'element-plus/theme-chalk/el-notification.css'

const email = 'admin@punkalender.ch'

const copyEmail = () => {
  navigator.clipboard.writeText(email).then(() => {
    ElNotification({
      title: 'Erfolg',
      message: 'Mail kopiert',
      type: 'success',
    })
  }).catch(err => {
    ElNotification({
      title: 'Fehler',
      message: 'Fehler beim Kopieren der Mail',
      type: 'error',
    })
  })
}
</script>

<style scoped>
a {
  cursor: pointer;
}
</style>
