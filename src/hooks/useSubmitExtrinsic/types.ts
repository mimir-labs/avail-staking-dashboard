// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyApi, MaybeAddress } from 'types';

export interface UseSubmitExtrinsicProps {
  tx: AnyApi;
  from: MaybeAddress;
  shouldSubmit: boolean;
  callbackSubmit?: () => void;
  callbackInBlock?: () => void;
  inBinance?: boolean;
  logs?: any;
  addLog?: any;
}

export interface UseSubmitExtrinsic {
  uid: number;
  onSubmit: () => void;
  submitting: boolean;
  proxySupported: boolean;
  submitAddress: MaybeAddress;
}
