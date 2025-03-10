import { IStarknetWindowObject, getStarknet } from "@argent/get-starknet"
import type { NextPage } from "next"
import Head from "next/head"
import { useEffect, useMemo, useState } from "react"

import { TokenDapp } from "../components/TokenDapp"
import { truncateAddress } from "../services/address.service"
import {
  addWalletChangeListener,
  connectWallet,
  networkUrl,
  removeWalletChangeListener,
  silentConnectWallet,
} from "../services/wallet.service"
import styles from "../styles/Home.module.css"

const Home: NextPage = () => {
  const [address, setAddress] = useState<string>()
  const [isConnected, setConnected] = useState(false)

  useEffect(() => {
    ;(async () => {
      const wallet = await silentConnectWallet()
      setAddress(wallet?.selectedAddress)
      setConnected(!!wallet?.isConnected)
    })()

    const handler = async () => {
      const wallet = await silentConnectWallet()
      setAddress(wallet?.selectedAddress)
      setConnected(!!wallet?.isConnected)
    }
    addWalletChangeListener(handler)
    return () => {
      removeWalletChangeListener(handler)
    }
  }, [])

  const handleConnectClick = async () => {
    const wallet = await connectWallet()
    setAddress(wallet?.selectedAddress)
    setConnected(!!wallet?.isConnected)
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Argent x StarkNet test dapp</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {isConnected ? (
          <>
            <h3 style={{ margin: 0 }}>
              Wallet address: <code>{address && truncateAddress(address)}</code>
            </h3>
            <h3 style={{ margin: 0 }}>
              Url: <code>{networkUrl()}</code>
            </h3>
            <TokenDapp />
          </>
        ) : (
          <>
            <button className={styles.connect} onClick={handleConnectClick}>
              Connect Wallet
            </button>
            <p>First connect wallet to use dapp.</p>
          </>
        )}
      </main>
    </div>
  )
}

export default Home
