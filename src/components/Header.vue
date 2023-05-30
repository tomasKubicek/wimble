<template>
    <header>
        <div class="logo">
            <h1>WIMBLE</h1>
        </div>
        <div class="connection" data-status="not-connected">
            <div class="icon">!</div>
            <div class="statusmsg">Připojte zařízení micro:bit pomocí bluetooth.</div>
        </div>
    </header>
</template>

<style lang="scss" scoped>
    header {
        display: flex;
        flex-direction: row;
        color: #fff;
        .logo {
            background-color: #000;
            padding: 1.2rem 3.6rem;
            h1 {
                padding: 0;
                margin: 0;
                font-size: 2.4rem;
                letter-spacing: .4rem;
            }
            //border: 2px solid #121212;
        }
        .connection {
            padding: 1.2rem 3.6rem;
            width: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
            font-weight: 600;
            .icon {
                box-sizing: border-box;
                border: 2px solid #fff;
                border-radius: 50%;
                width: 2.1rem;
                height: 2.1rem;
                font-size: 1.2rem;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                margin-right: 1.2rem;
            }
            .statusmsg {
                font-size: 1.2rem;
            }

            &[data-status="not-connected"] {
                background-color: rgb(214, 143, 11);
            }
            &[data-status="connected"] {
                background-color: rgb(41, 165, 10);
            }
            &[data-status="disconnected"] {
                background-color: rgb(155, 11, 11);
            }

        }
    }
</style>