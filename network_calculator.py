#!/usr/bin/env python3
"""
Network Subnet Calculator
A simple tool for network infrastructure planning - useful for cabling and network installations
"""

def calculate_subnet_info(ip_address, subnet_mask):
    """
    Calculate network information from an IP address and subnet mask

    Args:
        ip_address: IP address as a string (e.g., "192.168.1.10")
        subnet_mask: Subnet mask as a string (e.g., "255.255.255.0")

    Returns:
        Dictionary with network information
    """

    # Convert IP address string to list of integers
    # Example: "192.168.1.10" becomes [192, 168, 1, 10]
    ip_octets = [int(octet) for octet in ip_address.split('.')]

    # Convert subnet mask string to list of integers
    # Example: "255.255.255.0" becomes [255, 255, 255, 0]
    mask_octets = [int(octet) for octet in subnet_mask.split('.')]

    # Calculate network address by performing bitwise AND operation
    # This gives us the base address of the network
    network_octets = [ip_octets[i] & mask_octets[i] for i in range(4)]

    # Calculate broadcast address by performing bitwise OR with inverted mask
    # This gives us the last usable address in the network
    broadcast_octets = [ip_octets[i] | (~mask_octets[i] & 0xFF) for i in range(4)]

    # Calculate the number of host bits (bits that are 0 in the subnet mask)
    # This tells us how many devices can connect to this network
    host_bits = sum(bin(255 - octet).count('1') for octet in mask_octets)

    # Calculate total number of IP addresses in this subnet
    # Formula: 2^(number of host bits)
    total_hosts = 2 ** host_bits

    # Calculate usable host addresses
    # We subtract 2 because network address and broadcast address can't be assigned to devices
    usable_hosts = total_hosts - 2

    # Calculate first usable IP (network address + 1)
    first_usable = network_octets.copy()
    first_usable[3] += 1

    # Calculate last usable IP (broadcast address - 1)
    last_usable = broadcast_octets.copy()
    last_usable[3] -= 1

    # Return all calculated information as a dictionary
    return {
        'ip_address': ip_address,
        'subnet_mask': subnet_mask,
        'network_address': '.'.join(map(str, network_octets)),
        'broadcast_address': '.'.join(map(str, broadcast_octets)),
        'first_usable_ip': '.'.join(map(str, first_usable)),
        'last_usable_ip': '.'.join(map(str, last_usable)),
        'total_hosts': total_hosts,
        'usable_hosts': usable_hosts
    }


def print_network_info(network_info):
    """
    Display network information in a readable format

    Args:
        network_info: Dictionary containing network information
    """
    print("\n" + "="*50)
    print("NETWORK SUBNET INFORMATION")
    print("="*50)
    print(f"IP Address:          {network_info['ip_address']}")
    print(f"Subnet Mask:         {network_info['subnet_mask']}")
    print(f"Network Address:     {network_info['network_address']}")
    print(f"Broadcast Address:   {network_info['broadcast_address']}")
    print(f"First Usable IP:     {network_info['first_usable_ip']}")
    print(f"Last Usable IP:      {network_info['last_usable_ip']}")
    print(f"Total IP Addresses:  {network_info['total_hosts']}")
    print(f"Usable Hosts:        {network_info['usable_hosts']}")
    print("="*50 + "\n")


# Main program execution starts here
if __name__ == "__main__":
    # Example 1: Small office network (Class C network)
    # This subnet can support 254 devices - ideal for small to medium offices
    print("Example 1: Small Office Network")
    network1 = calculate_subnet_info("192.168.1.10", "255.255.255.0")
    print_network_info(network1)

    # Example 2: Large enterprise network
    # This subnet can support 1022 devices - suitable for larger organizations
    print("Example 2: Large Enterprise Network")
    network2 = calculate_subnet_info("10.0.0.50", "255.255.252.0")
    print_network_info(network2)

    # Example 3: Very small network (point-to-point link)
    # This subnet can support only 2 devices - useful for router-to-router connections
    print("Example 3: Point-to-Point Link")
    network3 = calculate_subnet_info("172.16.0.1", "255.255.255.252")
    print_network_info(network3)

    # Prompt user for custom input
    print("\nCalculate your own subnet:")
    print("-" * 50)

    try:
        # Get user input for IP address
        user_ip = input("Enter an IP address (e.g., 192.168.1.10): ").strip()

        # Get user input for subnet mask
        user_mask = input("Enter subnet mask (e.g., 255.255.255.0): ").strip()

        # Calculate and display the network information
        user_network = calculate_subnet_info(user_ip, user_mask)
        print_network_info(user_network)

    except (ValueError, IndexError) as e:
        # Handle errors if user enters invalid IP or subnet mask
        print(f"\nError: Invalid IP address or subnet mask format.")
        print("Please use format: xxx.xxx.xxx.xxx")
    except KeyboardInterrupt:
        # Handle graceful exit if user presses Ctrl+C
        print("\n\nProgram terminated by user.")
