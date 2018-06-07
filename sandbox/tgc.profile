# Firejail profile for tgc

include /etc/firejail/disable-common.inc
include /etc/firejail/disable-devel.inc

# include /etc/firejail/whitelist-var-common.inc

caps.drop all
netfilter
no3d
nodvd
nogroups
nonewprivs
noroot
nosound
notv
novideo
seccomp
shell none
tracelog

private
read-only /
read-only /tmp

noexec /
noexec ${HOME}
blacklist ${HOME}