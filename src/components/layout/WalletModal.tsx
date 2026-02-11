"use client";

import { CloseLine } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalClose,
  ModalContent,
  ModalTitle,
  ModalTrigger,
} from "@/components/ui/modal";
import { useWallet } from "@/hooks/useWallet";
import { useAuth } from "@/providers/AuthProvider";
import { cn } from "@/utils";
import { toast } from "@/utils/toast";
import { useWalletConnectors } from "@phoenix-wallet/core";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

interface WalletModalProps {
  children: React.ReactNode;
}

const Connector = ({
  connectorId,
  onConnect,
  showRecent = false,
}: {
  connectorId: string;
  onConnect?: (connectorId: string) => void;
  showRecent?: boolean;
}) => {
  const { isInstalled, connector, connect } = useWallet(connectorId);
  const { setConnectorId, isConnecting } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    setLoading(true);
    try {
      setConnectorId(connectorId);
      await connect();
      onConnect?.(connectorId);
    } catch (err: any) {
      toast.error(err?.message || "Failed to connect");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      key={connector?.name}
      className={cn(
        "flex items-center justify-between p-5 cursor-pointer transition-colors border border-neutral-02 hover:bg-overlay-light-5"
      )}
      onClick={handleConnect}
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 flex items-center justify-center">
          <Image
            src={connector?.logo || ""}
            alt={connector?.name || ""}
            width={40}
            height={40}
          />
        </div>
        <span className="text-label-lg">
          {connector?.name?.toLowerCase() || ""}
        </span>
      </div>

      {showRecent && !isConnecting && isInstalled && !loading && (
        <span className="text-label-sm text-neutral-tertiary">recent</span>
      )}

      {isConnecting && <Loader2 className="animate-spin" />}

      {!isInstalled && (
        <Button
          variant="secondary"
          buttonType="transparent"
          size="md"
          className="bg-overlay-light-5"
          onClick={(e) => {
            e.stopPropagation();
            window.open(connector?.installLink || "", "_blank");
          }}
        >
          Install
        </Button>
      )}
    </div>
  );
};

export const WalletModal = ({ children }: WalletModalProps) => {
  const { connectors } = useWalletConnectors();
  const [open, setOpen] = useState(false);
  const { lastUsedConnectorId } = useAuth();
  const handleSelectWallet = () => setOpen(false);

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger asChild>{children}</ModalTrigger>
      <ModalContent
        className="p-6 bg-neutral-02 md:max-w-[440px] gap-4 border-none shadow-[0px_0px_64px_0px_rgba(0,0,0,0.05)]"
        closeable={false}
      >
        <div className="flex items-center justify-between">
          <ModalTitle className="text-heading-sm">connect wallet</ModalTitle>
          <ModalClose className="flex items-center justify-center hover:bg-overlay-light-5 w-9 h-9">
            <CloseLine />
          </ModalClose>
        </div>

        <div className="flex flex-col gap-3 mt-2">
          {connectors.map((connector) => (
            <Connector
              key={connector.id}
              connectorId={connector.id}
              onConnect={handleSelectWallet}
              showRecent={lastUsedConnectorId === connector.id}
            />
          ))}
        </div>
      </ModalContent>
    </Modal>
  );
};

export default WalletModal;
