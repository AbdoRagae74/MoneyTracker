import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Bill {
  id: number;
  details: string;
  quantity?: number;
  price: number;
  userId: string;
  createdAt: string;
  updatedAt?: string;
}

@Component({
  selector: 'app-bills',
  imports: [CommonModule, FormsModule],
  templateUrl: './bills.html',
  styleUrl: './bills.css',
})
export class Bills implements OnInit {
  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  // url: string = "https://localhost:7111/api/";
  url: string = "https://moneytracker.runasp.net/api/";
  bills: Bill[] = [];
  filteredBills: Bill[] = [];
  selectedBill: Bill | null = null;
  newBill: Partial<Bill> = {
    details: '',
    quantity: 1,
    price: 0,
    userId: '1' // You might want to get this from authentication
  };
  searchText: string = '';
  startDate: string = '';
  endDate: string = '';
  isEditModalOpen = false;
  isAddModalOpen = false;
  isLoading = false;
  isSearching = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadBills();
  }

  loadBills(): void {
    this.isLoading = true;
    this.http.get<Bill[]>(this.url + "Bill").subscribe({
      next: (resp) => {
        console.log(resp)
        this.bills = resp;
        this.filteredBills = resp;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading bills:', err);
        this.errorMessage = 'Failed to load bills';
        this.isLoading = false;
      }
    });
  }

  openEditModal(bill: Bill): void {
    this.selectedBill = { ...bill };
    this.isEditModalOpen = true;
    this.errorMessage = '';
  }

  closeEditModal(): void {
    this.isEditModalOpen = false;
    this.selectedBill = null;
    this.errorMessage = '';
  }

  openAddModal(): void {
    this.newBill = {
      details: '',
      quantity: 1,
      price: 0,
      userId: '1'
    };
    this.isAddModalOpen = true;
    this.errorMessage = '';
  }

  closeAddModal(): void {
    this.isAddModalOpen = false;
    this.newBill = {
      details: '',
      quantity: 1,
      price: 0,
      userId: 'default-user-id'
    };
    this.errorMessage = '';
  }

  saveBill(): void {
    if (!this.selectedBill) return;

    this.isLoading = true;
    this.http.put(this.url + `Bill/${this.selectedBill.id}`, this.selectedBill).subscribe({
      next: () => {
        this.loadBills();
        this.closeEditModal();
        this.isLoading = false;
      },
      error: (err) => {
        console.log(this.selectedBill);
        console.error('Error updating bill:', err);
        this.errorMessage = 'Failed to update bill';
        this.isLoading = false;
      }
    });
  }

  addNewBill(): void {
    console.log(this.newBill)

    if (!this.newBill.details || !this.newBill.price) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }
    

    this.isLoading = true;
    console.log(this.newBill)
    this.http.post(this.url + "Bill", this.newBill).subscribe({
      next: () => {
        this.loadBills();
        this.closeAddModal();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error adding bill:', err);
        this.errorMessage = 'Failed to add bill';
        this.isLoading = false;
      }
    });
  }

  deleteBill(billId: number): void {
    if (!confirm('Are you sure you want to delete this bill?')) return;

    this.isLoading = true;
    this.http.delete(this.url + `Bill/${billId}`).subscribe({
      next: () => {
        this.loadBills();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error deleting bill:', err);
        this.errorMessage = 'Failed to delete bill';
        this.isLoading = false;
      }
    });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EGP'
    }).format(amount);
  }

  trackByBillId(index: number, bill: Bill): number {
    return bill.id;
  }

  searchBills(): void {
    if (!this.searchText.trim()) {
      this.filteredBills = this.bills;
      return;
    }

    this.isSearching = true;
    this.errorMessage = '';

    // Call the backend search endpoint
    this.http.post<Bill[]>(this.url + "Bill/srch", null, {
      params: { txt: this.searchText.trim() }
    }).subscribe({
      next: (resp) => {
        this.filteredBills = resp;
        this.isSearching = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error searching bills:', err);
        this.errorMessage = 'Failed to search bills';
        this.isSearching = false;
        // Fallback to client-side filtering
        this.filterBillsLocally();
      }
    });
  }

  filterBillsLocally(): void {
    if (!this.searchText.trim()) {
      this.filteredBills = this.bills;
      return;
    }

    const searchTerm = this.searchText.toLowerCase().trim();
    this.filteredBills = this.bills.filter(bill => 
      bill.details.toLowerCase().includes(searchTerm)
    );
  }

  clearSearch(): void {
    this.searchText = '';
    this.applyFilters();
    this.errorMessage = '';
  }

  onSearchInput(): void {
    // Debounce search - search after user stops typing for 500ms
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.searchBills();
    }, 500);
  }

  private searchTimeout: any;

  filterByDate(): void {
    if (!this.startDate && !this.endDate) {
      this.applyFilters();
      return;
    }

    const startDate = this.startDate ? new Date(this.startDate) : null;
    const endDate = this.endDate ? new Date(this.endDate) : null;

    this.filteredBills = this.bills.filter(bill => {
      const billDate = new Date(bill.createdAt);
      
      if (startDate && endDate) {
        return billDate >= startDate && billDate <= endDate;
      } else if (startDate) {
        return billDate >= startDate;
      } else if (endDate) {
        return billDate <= endDate;
      }
      return true;
    });
  }

  applyFilters(): void {
    let filtered = [...this.bills];

    // Apply text search filter
    if (this.searchText.trim()) {
      const searchTerm = this.searchText.toLowerCase().trim();
      filtered = filtered.filter(bill => 
        bill.details.toLowerCase().includes(searchTerm)
      );
    }

    // Apply date filter
    if (this.startDate || this.endDate) {
      const startDate = this.startDate ? new Date(this.startDate) : null;
      const endDate = this.endDate ? new Date(this.endDate) : null;

      filtered = filtered.filter(bill => {
        const billDate = new Date(bill.createdAt);
        
        if (startDate && endDate) {
          return billDate >= startDate && billDate <= endDate;
        } else if (startDate) {
          return billDate >= startDate;
        } else if (endDate) {
          return billDate <= endDate;
        }
        return true;
      });
    }

    this.filteredBills = filtered;
  }

  clearDateFilter(): void {
    this.startDate = '';
    this.endDate = '';
    this.applyFilters();
  }

  getTotalAmount(): number {
    return this.filteredBills.reduce((total, bill) => {
      return total + (bill.price * (bill.quantity || 1));
    }, 0);
  }

  getTotalCount(): number {
    return this.filteredBills.length;
  }

  onDateChange(): void {
    this.applyFilters();
  }
}
