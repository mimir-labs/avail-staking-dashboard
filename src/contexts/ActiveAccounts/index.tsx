// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext, useRef, useState } from 'react';
import type { MaybeAddress } from 'types';
import { setStateWithRef } from '@w3ux/utils';
import { useNetwork } from 'contexts/Network';
import type { ActiveAccountsContextInterface, ActiveProxy } from './types';
import { defaultActiveAccountsContext } from './defaults';
import Keyring from '@polkadot/keyring';
import { useInjectMimir } from 'hooks/useMimir';

export const ActiveAccountsContext =
  createContext<ActiveAccountsContextInterface>(defaultActiveAccountsContext);

export const useActiveAccounts = () => useContext(ActiveAccountsContext);

export const ActiveAccountsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { network, networkData } = useNetwork();

  // Store the currently active account.
  const [activeAccount, setActiveAccountState] = useState<MaybeAddress>(null);
  const activeAccountRef = useRef<string | null>(activeAccount);

  // Store the active proxy account.
  const [activeProxy, setActiveProxyState] = useState<ActiveProxy>(null);
  const activeProxyRef = useRef(activeProxy);

  // Setter for the active proxy account.
  const setActiveProxy = (newActiveProxy: ActiveProxy, updateLocal = true) => {
    if (updateLocal) {
      if (newActiveProxy) {
        localStorage.setItem(
          `${network}_active_proxy`,
          JSON.stringify(newActiveProxy)
        );
      } else {
        localStorage.removeItem(`${network}_active_proxy`);
      }
    }
    setStateWithRef(newActiveProxy, setActiveProxyState, activeProxyRef);
  };

  // Setter for the active account.
  const setActiveAccount = (
    newActiveAccountUnformatted: MaybeAddress,
    updateLocalStorage = true
  ) => {
    const keyring = new Keyring();
    keyring.setSS58Format(networkData.ss58);
    const newActiveAccount: MaybeAddress = newActiveAccountUnformatted
      ? keyring.addFromAddress(newActiveAccountUnformatted).address
      : null;
    if (updateLocalStorage) {
      if (newActiveAccount === null) {
        localStorage.removeItem(`${network}_active_account`);
      } else {
        localStorage.setItem(`${network}_active_account`, newActiveAccount);
      }
    }

    setStateWithRef(newActiveAccount, setActiveAccountState, activeAccountRef);
  };

  // Getter for the active account.
  const getActiveAccount = () => activeAccountRef.current;

  // inject mimir if necessary
  useInjectMimir();

  return (
    <ActiveAccountsContext.Provider
      value={{
        activeAccount: activeAccountRef.current,
        activeProxy: activeProxy?.address || null,
        activeProxyType: activeProxy?.proxyType || null,
        activeProxyRef: activeProxyRef.current || null,
        setActiveAccount,
        getActiveAccount,
        setActiveProxy,
      }}
    >
      {children}
    </ActiveAccountsContext.Provider>
  );
};
